describe('Test SSO → Master', () => {
  it('Đăng nhập SSO và kiểm tra master', () => {
    // Truy cập trực tiếp link SSO
    cy.visit(
      'https://sso-dd-int.devlead.top/auth?client_id=qtud-master&redirect_uri=https%3A%2F%2Fdd3a.devlead.top%2Fxac-thuc'
    );

    // Nhập username
    cy.get('#username').type('035304008806');

    // Nhập password
    cy.get('#password').type('DevTest@123456', { log: false });

    // Click nút Đăng nhập
    cy.contains('button', 'Đăng nhập').click();

    //redirect về dd3a.devlead.top/xac-thuc
    cy.origin('https://dd3a.devlead.top', () => {
      // Kiểm tra trang master đã load
      cy.contains('Cấu trúc dữ liệu địa bàn CSKV').click();
    });
   cy.origin('https://dd3a.devlead.top', () => {
      // Check tên profile hiển thị
      cy.contains('Nguyễn Thị Phương Anh - 035304008806').should('be.visible');
    });
  });
  });
