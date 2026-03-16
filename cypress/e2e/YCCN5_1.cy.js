
import {CSKVData } from '../support/data';
describe("SSO → CSKV", () => {
  const data = {
    username: "077777777777",
    password: "DevTest@123456",
  };
  beforeEach(() => {
    cy.checkTokenAndLogin(data.username, data.password);
    cy.visit("https://dd3a.devlead.top");
  });

  it("Kiểm tra thêm mới thành công ", () => {
    cy.contains("Cấu trúc dữ liệu địa bàn CSKV", { timeout: 10000 }).should("be.visible").click();
    cy.contains("Địa bàn").click({ force: true });
    cy.contains("Yêu cầu cập nhật, bổ sung địa bàn").should("be.visible").click();
    cy.contains("Thêm mới").click({ force: true });
    cy.get('app-input[formcontrolname="name"] input:visible').type("AUTO_123");
    cy.get('app-select[formcontrolname="localTypeId"] input:visible').click({ force: true }) .type(CSKVData.localType);
    cy.contains(".ant-select-item", "Thôn").click();
    cy.get('app-input[formcontrolname="idNumber"] input:visible').type(CSKVData.idNumber);
    cy.get('app-input[formcontrolname="fullName"] input:visible') .type(CSKVData.fullName);
    cy.get('input[placeholder="dd/mm/yyyy"]').type(CSKVData.birthDate);
    cy.get('[formcontrolname="termEndAt"] input').type(CSKVData.termEnd);
    cy.contains("button", "Ghi").click({ force: true });
    // cy.contains("lưu dữ liệu thành công").should("be.visible");
    cy.get('[data-icon="delete"]').first().click({ force: true });
    cy.contains("Đồng ý").click({ force: true });
  });
  it("Kiểm tra thêm mới không thành công ký tự quá 12", () => {
    cy.contains("Cấu trúc dữ liệu địa bàn CSKV", { timeout: 10000 }).should("be.visible").click();
    cy.contains("Địa bàn").click({ force: true });
    cy.contains("Yêu cầu cập nhật, bổ sung địa bàn").should("be.visible").click();
    cy.contains("Thêm mới").click({ force: true });
    cy.get('app-input[formcontrolname="name"] input:visible').type("AUTO_123");
    cy.get('app-select[formcontrolname="localTypeId"] input:visible').click({ force: true }) .type(CSKVData.localType);
    cy.contains(".ant-select-item", "Thôn").click();
    cy.get('app-input[formcontrolname="idNumber"] input:visible').type(CSKVData.idNumberInvalid);
    cy.get('app-input[formcontrolname="fullName"] input:visible') .type(CSKVData.fullName);
    cy.get('input[placeholder="dd/mm/yyyy"]').type(CSKVData.birthDate);
    cy.get('[formcontrolname="termEndAt"] input').type(CSKVData.termEnd);
    cy.contains("button", "Ghi").click({ force: true });
    cy.contains(" Số ĐDCN phải đủ 12 ký tự").should("be.visible");
});
it("kiểm tra không thành công , xác thực thông thành công ", () => {
//  đâfdasdasf
});
});