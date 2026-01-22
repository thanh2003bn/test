import ForeignCitizenListPage from "../support/Quanly_NNN";
import { ForeignCitizenCreatePage } from "../support/Quanly_NNN";
import { ValidationCreatePage } from "../support/Quanly_NNN";
import { ForeignCitizenUpdate } from "../support/Pages/Capnhat";

const Creat = require("../fixtures/Validation.json");

describe("Quản lý người nước ngoài", () => {
  const username = "030302003834";
  const password = "DevTest@123456";
  let page;
  let page1;
  let p2;
  let validate;
  let createdCitizenId;
  // ===SETUP CHUNG===
  beforeEach(() => {
    cy.checkTokenAndLogin(username, password);
    cy.visit(
      "https://dd3a.devlead.top/cskv-ct/nguoi-nuoc-ngoai/quan-ly-nguoi-nuoc-ngoai"
    );
    page = new ForeignCitizenCreatePage();
    validate = new ValidationCreatePage(page);
    page1 = new ForeignCitizenListPage();
    p2 = new ForeignCitizenUpdate();
    page1.btnAddNew().click();
    page.form().should("be.visible");
    cy.intercept("POST", "**/foreign-citizen").as("createApi");
    cy.intercept("POST", "**/lp-careers/").as("TaoNN");
    cy.intercept("PUT", "**/foreign-citizen**").as("UpdateApi");
    cy.intercept("PUT", "**/foreign-citizen/send").as("SendApi");
    cy.intercept('DELETE','/api/cskv/ctdl/foreign-citizen/**').as('DeleteApi')
    cy.intercept("**/foreign-citizen/**").as("searchApi");
    cy.intercept("GET","**/foreign-citizen/**").as("Get");

  });
  //----- Case thêm mới
  it('Thêm mới thành công', () => {
    const uid = Date.now();
    const P = {
      citizenId: `P ${uid}`,
      Name: `Alice${uid}`
    };
    page.citizenIdInput().type(P.citizenId);
    page.fullNameInput().type(P.Name);
    page.birthDatePicker().first().scrollIntoView()
      .click({ force: true })
      .type('{selectall}{backspace}', { force: true })
      .type(26011990, { force: true }).blur({ force: true });
    page.genderSelect().type('Nữ');
    cy.get('.ant-select-item-option-content').should('contain', 'Nữ').click();
    page.nationalitySelect().type('Netherlands');
    cy.get('.ant-select-item-option-content').should('contain', 'Netherlands').click();
    page.typeSelect().type('Thường trú');
    cy.get('.ant-select-item-option-content').should('contain', 'Thường trú').click();
    //Số giấy tờ cư trú
    page.residenceCertificateNumberInput().type('TT123456');
    page.reasonResidenceSelect().type('Thăm thân');
    cy.get('.ant-select-item-option-content').should('contain', 'Thăm thân').click();
    page.periodFromDatePicker().type('01012026');
    page.periodToDatePicker().type('01022026');
    //Ngày đến cư trú
    page.residentFromDatePicker().type('02012026');
    page.localSelect().type('Bôn 168')
    cy.get('.ant-select-item-option-content').should('contain', 'Bôn 168').click();
    const citizenDuplicate = P.citizenId;
    page.submitBtn().click();
    // đợi API tạo
    cy.wait('@createApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    cy.contains('.ant-message-notice-content, .ant-notification-notice, .toast, body', 'Thêm mới thành công',
      { timeout: 10000 }).should('be.visible');
      // Check tìm kiếm đc bản ghi vừa tạo
       page1.searchForm().should("be.visible");
    page1.clearAll();
    page1.citizenIdInput().type(P.citizenId)
    page1.submitSearch();
    cy.wait('@searchApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    cy.contains('td', P.citizenId).should("be.visible");
  });

  it.only('Thêm mới thất bại- Trùng Citizenid', () => {
    const uid = Date.now();
    const P = {
      citizenId: `P ${uid}`,
      Name: `Alice${uid}`
    };
    page.citizenIdInput().type(P.citizenId);
    page.fullNameInput().type(P.Name);
    page.birthDatePicker().first().scrollIntoView()
      .click({ force: true })
      .type('{selectall}{backspace}', { force: true })
      .type(26011990, { force: true }).blur({ force: true });
    page.genderSelect().type('Nữ');
    cy.get('.ant-select-item-option-content').should('contain', 'Nữ').click();
    page.nationalitySelect().type('Netherlands');
    cy.get('.ant-select-item-option-content').should('contain', 'Netherlands').click();
    page.typeSelect().type('Thường trú');
    cy.get('.ant-select-item-option-content').should('contain', 'Thường trú').click();
    //Số giấy tờ cư trú
    page.residenceCertificateNumberInput().type('TT123456');
    page.reasonResidenceSelect().type('Thăm thân');
    cy.get('.ant-select-item-option-content').should('contain', 'Thăm thân').click();
    page.periodFromDatePicker().type('01012026');
    page.periodToDatePicker().type('01022026');
    //Ngày đến cư trú
    page.residentFromDatePicker().type('02012026');
    page.localSelect().type('Bôn 168')
    cy.get('.ant-select-item-option-content').should('contain', 'Bôn 168').click();
    const citizenDuplicate = P.citizenId;
    page.submitBtn().click();
    // đợi API tạo
    cy.wait('@createApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    // ===== RESET FORM / MỞ LẠI MODAL =====
    //  page1.openCreateModal()
    page1.btnAddNew().click();
    page.form().should('be.visible');

    //===== LẦN 2: THÊM MỚI BỊ TRÙNG =====
    page.citizenIdInput().type(P.citizenId);
    page.fullNameInput().type(`Alice Duplicate`);

    page.birthDatePicker()
      .click({ force: true })
      .type('{selectall}{backspace}')
      .type('26011990')
      .blur();

    page.genderSelect().click().type('Nữ');
    cy.contains('.ant-select-item-option-content', 'Nữ').click();

    page.nationalitySelect().click().type('Netherlands');
    cy.contains('.ant-select-item-option-content', 'Netherlands').click();

    page.typeSelect().click().type('Thường trú');
    cy.contains('.ant-select-item-option-content', 'Thường trú').click();
    //Số giấy tờ cư trú
    page.residenceCertificateNumberInput().type('TT123456');
    page.reasonResidenceSelect().type('Thăm thân');
    cy.get('.ant-select-item-option-content').should('contain', 'Thăm thân').click();
    page.periodFromDatePicker().type('01012026');
    page.periodToDatePicker().type('01022026');
    //Ngày đến cư trú
    page.residentFromDatePicker().type('02012026');
    page.localSelect().type('Bôn 168')
    cy.get('.ant-select-item-option-content').should('contain', 'Bôn 168').click();
    page.submitBtn().click();
    cy.contains(
      '.ant-message-notice-content, .ant-message-custom-content',
      'Thông tin công dân đã tồn tại',
      { timeout: 10000 }
    ).should('be.visible');
  })

  // ForeignCitizenUpdate
  it('Thêm mới - Chỉnh sửa', () => {
    const uid = Date.now();
    const P = {
      citizenId: `P ${uid}`,
      Name: `Alice${uid}`
    };
    page.citizenIdInput().type(P.citizenId);
    page.fullNameInput().type(P.Name);
    page.birthDatePicker().first().scrollIntoView()
      .click({ force: true })
      .type('{selectall}{backspace}', { force: true })
      .type(26011990, { force: true }).blur({ force: true });
    page.genderSelect().type('Nữ');
    cy.get('.ant-select-item-option-content').should('contain', 'Nữ').click();
    page.nationalitySelect().type('Netherlands');
    cy.get('.ant-select-item-option-content').should('contain', 'Netherlands').click();
    page.typeSelect().type('Thường trú');
    cy.get('.ant-select-item-option-content').should('contain', 'Thường trú').click();
    //Số giấy tờ cư trú
    page.residenceCertificateNumberInput().type('TT123456');
    page.reasonResidenceSelect().type('Thăm thân');
    cy.get('.ant-select-item-option-content').should('contain', 'Thăm thân').click();
    // Thời gian cư trú
    page.periodFromDatePicker().type('01012026');
    page.periodToDatePicker().type('01022026');
    //Ngày đến cư trú
    page.residentFromDatePicker().type('02012026');
    page.localSelect().type('Làng 02')
    cy.get('.ant-select-item-option-content').should('contain', 'Làng 02').click();
    // const citizenDuplicate = P.citizenId;
    page.submitBtn().click();
    // đợi API tạo
    cy.wait('@createApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    // ===== Chỉnh sửa =====
    page1.searchForm().should("be.visible");

    //===== tìm kiếm bản ghi vừa thêm mới qua p.citi =====
    page1.clearAll();
    page1.citizenIdInput().type(P.citizenId)
    page1.submitSearch();
    cy.wait('@searchApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    cy.contains('td', P.citizenId).closest('tr').find('i.anticon-edit').click();
cy.wait('@Get').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
p2.MucDichCuTru().click({ force: true }).type('Học tập');
cy.get('.ant-select-item-option-content').should('contain', 'Học tập').click();
p2.saveBtn().click()
cy.wait('@UpdateApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
     cy.contains(
        '.ant-message-notice-content, .ant-message-custom-content',
        'Cập nhật thông tin thành công',
        { timeout: 10000 }
      ).should('be.visible');
  })
it('Thêm mới - Xóa', () => {
    const uid = Date.now();
    const P = {
      citizenId: `P ${uid}`,
      Name: `Alice${uid}`
    };
    page.citizenIdInput().type(P.citizenId);
    page.fullNameInput().type(P.Name);
    page.birthDatePicker().first().scrollIntoView()
      .click({ force: true })
      .type('{selectall}{backspace}', { force: true })
      .type(26011990, { force: true }).blur({ force: true });
    page.genderSelect().type('Nữ');
    cy.get('.ant-select-item-option-content').should('contain', 'Nữ').click();
    page.nationalitySelect().type('Netherlands');
    cy.get('.ant-select-item-option-content').should('contain', 'Netherlands').click();
    page.typeSelect().type('Thường trú');
    cy.get('.ant-select-item-option-content').should('contain', 'Thường trú').click();
    //Số giấy tờ cư trú
    page.residenceCertificateNumberInput().type('TT123456');
    page.reasonResidenceSelect().type('Thăm thân');
    cy.get('.ant-select-item-option-content').should('contain', 'Thăm thân').click();
    // Thời gian cư trú
    page.periodFromDatePicker().type('01012026');
    page.periodToDatePicker().type('01022026');
    //Ngày đến cư trú
    page.residentFromDatePicker().type('02012026');
    page.localSelect().type('Làng 02')
    cy.get('.ant-select-item-option-content').should('contain', 'Làng 02').click();
    // const citizenDuplicate = P.citizenId;
    page.submitBtn().click();
    // đợi API tạo
    cy.wait('@createApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    // ===== Mở Form =====
    page1.searchForm().should("be.visible");

    //===== tìm kiếm bản ghi vừa thêm mới qua p.citi =====
    page1.clearAll();
    page1.citizenIdInput().type(P.citizenId)
    page1.submitSearch();
    cy.wait('@searchApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    cy.contains('td', P.citizenId).closest('tr').find('i.anticon-delete').click();
cy.get('.ant-modal')
  .should('be.visible')
  .within(() => {
    cy.contains('Xác nhận xóa bản ghi?').should('be.visible');
    cy.contains('button', 'Đồng ý').should('be.visible');
    cy.contains('button', 'Từ chối').should('be.visible');
  });
cy.get('.ant-modal')
  .contains('button', 'Đồng ý')
  .click();

cy.wait('@DeleteApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    //  cy.contains(
    //     '.ant-message-notice-content, .ant-message-custom-content',
    //     'Xóa dữ liệu thành công',
    //     { timeout: 10000 }
    //   ).should('be.visible');
  })
it('Thêm mới - Xem chi tiết', () => {
    const uid = Date.now();
    const P = {
      citizenId: `P ${uid}`,
      Name: `Alice${uid}`
    };
    page.citizenIdInput().type(P.citizenId);
    page.fullNameInput().type(P.Name);
    page.birthDatePicker().first().scrollIntoView()
      .click({ force: true })
      .type('{selectall}{backspace}', { force: true })
      .type(26011990, { force: true }).blur({ force: true });
    page.genderSelect().type('Nữ');
    cy.get('.ant-select-item-option-content').should('contain', 'Nữ').click();
    page.nationalitySelect().type('Netherlands');
    cy.get('.ant-select-item-option-content').should('contain', 'Netherlands').click();
    page.typeSelect().type('Thường trú');
    cy.get('.ant-select-item-option-content').should('contain', 'Thường trú').click();
    //Số giấy tờ cư trú
    page.residenceCertificateNumberInput().type('TT123456');
    page.reasonResidenceSelect().type('Thăm thân');
    cy.get('.ant-select-item-option-content').should('contain', 'Thăm thân').click();
    // Thời gian cư trú
    page.periodFromDatePicker().type('01012026');
    page.periodToDatePicker().type('01022026');
    //Ngày đến cư trú
    page.residentFromDatePicker().type('02012026');
    page.localSelect().type('Làng 02')
    cy.get('.ant-select-item-option-content').should('contain', 'Làng 02').click();
    // const citizenDuplicate = P.citizenId;
    page.submitBtn().click();
    // đợi API tạo
    cy.wait('@createApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    // ===== Xem chi tiết nào =====
    page1.searchForm().should("be.visible");

    //===== tìm kiếm bản ghi vừa thêm mới qua p.citi =====
    page1.clearAll();
    page1.citizenIdInput().type(P.citizenId)
    page1.submitSearch();
    cy.wait('@searchApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    cy.contains('td', P.citizenId).closest('tr').find('i.anticon-eye').click();
cy.wait('@Get').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    
  })
  it('Thêm mới - Gửi phê duyệt', () => {
    const uid = Date.now();
    const P = {
      citizenId: `P ${uid}`,
      Name: `Alice${uid}`
    };
    page.citizenIdInput().type(P.citizenId);
    page.fullNameInput().type(P.Name);
    page.birthDatePicker().first().scrollIntoView()
      .click({ force: true })
      .type('{selectall}{backspace}', { force: true })
      .type(26011990, { force: true }).blur({ force: true });
    page.genderSelect().type('Nữ');
    cy.get('.ant-select-item-option-content').should('contain', 'Nữ').click();
    page.nationalitySelect().type('Netherlands');
    cy.get('.ant-select-item-option-content').should('contain', 'Netherlands').click();
    page.typeSelect().type('Thường trú');
    cy.get('.ant-select-item-option-content').should('contain', 'Thường trú').click();
    //Số giấy tờ cư trú
    page.residenceCertificateNumberInput().type('TT123456');
    page.reasonResidenceSelect().type('Thăm thân');
    cy.get('.ant-select-item-option-content').should('contain', 'Thăm thân').click();
    // Thời gian cư trú
    page.periodFromDatePicker().type('01012026');
    page.periodToDatePicker().type('01022026');
    //Ngày đến cư trú
    page.residentFromDatePicker().type('02012026');
    page.localSelect().type('Làng 02')
    cy.get('.ant-select-item-option-content').should('contain', 'Làng 02').click();
    // const citizenDuplicate = P.citizenId;
    page.submitBtn().click();
    // đợi API tạo
    cy.wait('@createApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    // ===== Mở Form =====
    page1.searchForm().should("be.visible");

    //===== tìm kiếm bản ghi vừa thêm mới qua p.citi =====
    page1.clearAll();
    page1.citizenIdInput().type(P.citizenId)
    page1.submitSearch();
    cy.wait('@searchApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    cy.contains('td', P.citizenId).closest('tr').find('i.anticon-send').click();
cy.get('.ant-modal')
  .should('be.visible')
  .within(() => {
    cy.contains('Xác nhận gửi phê duyệt?').should('be.visible');
    cy.contains('button', 'Đồng ý').should('be.visible');
    cy.contains('button', 'Từ chối').should('be.visible');
  });
cy.get('.ant-modal')
  .contains('button', 'Đồng ý')
  .click();

cy.wait('@SendApi').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
    //  cy.contains(
    //     '.ant-message-notice-content, .ant-message-custom-content',
    //     'Gửi phê duyệt thành công',
    //     { timeout: 10000 }
    //   ).should('be.visible');
     page1.searchForm().should("be.visible");
     cy.contains('td', P.citizenId).closest('tr').find('nz-tag').should('contain.text','Chờ duyệt');
  })
it('Thêm mới nghề nghiệp thành công', () => {
  const uid = Date.now();
    const Name = `Nghề nghiệp ${uid}`
    page.ThemNghenghiep().click();
cy.get('[formcontrolname="name"]', { timeout: 20000 }).should("be.visible").type(Name);
   cy.get('.ant-modal')
  .contains('button', 'Ghi')
  .click();
  cy.wait('@TaoNN').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
  // Check  trường nghề nghề nghiệp
page.Nghenghiep().should('be.visible')
    .find('.ant-select-selection-item', { timeout: 10000 })
    .should('contain.text', Name);
  });
 
  it('Thêm mới nghề nghiệp thất bại- do trùng Tên', () => {
  const uid = Date.now();
    const Name = `Nghề nghiệp ${uid}`
    page.ThemNghenghiep().click();
cy.get('[formcontrolname="name"]', { timeout: 20000 }).should("be.visible").type(Name);
   cy.get('.ant-modal')
  .contains('button', 'Ghi')
  .click();
  cy.wait('@TaoNN').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([200, 201]);
    });
  // Check  trường nghề nghề nghiệp
page.Nghenghiep().should('be.visible')
    .find('.ant-select-selection-item', { timeout: 10000 })
    .should('contain.text', Name);
// Thêm lại lần 2
page.ThemNghenghiep().click();
cy.get('[formcontrolname="name"]', { timeout: 20000 }).should("be.visible").type(Name);
   cy.get('.ant-modal')
  .contains('button', 'Ghi')
  .click();

 cy.wait('@TaoNN').then(({ response }) => {
      expect(response?.statusCode).to.be.oneOf([400]);
    });
 cy.contains(
        '.ant-message-notice-content, .ant-message-custom-content',
        'Nghề nghiệp đã tồn tại',
        { timeout: 10000 }
      ).should('be.visible');
  });

});  