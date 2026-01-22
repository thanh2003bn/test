Cypress.Commands.add("checkTokenAndLogin", (username, password) => {
  const appOrigin = "https://dd3a.devlead.top";
  const appLoginPath = "/dang-nhap";
  const appRedirectPath = "/xac-thuc";

  const ssoOrigin = "https://sso-dd-int.devlead.top";
  const ssoAuthPath =
    "/auth?client_id=qtud-master&redirect_uri=https%3A%2F%2Fdd3a.devlead.top%2Fxac-thuc";

  cy.session(
    ["sso", username],
    () => {
      // 1️⃣ Vào trang login của app → redirect sang SSO
      cy.visit(`${appOrigin}${appLoginPath}`);

      // 2️⃣ Login trên SSO
      cy.origin(
        ssoOrigin,
        { args: { username, password, ssoAuthPath } },
        ({ username, password, ssoAuthPath }) => {
          cy.visit(ssoAuthPath);

          cy.get("#username")
            .clear()
            .type(username, { log: false });

          cy.get("#password")
            .clear()
            .type(password, { log: false });

          cy.contains("button", "Đăng nhập").click();
        }
      );

      // 3️⃣ Redirect về app
      cy.location("origin", { timeout: 60000 }).should("eq", appOrigin);
      cy.location("pathname", { timeout: 60000 }).should(
        "include",
        appRedirectPath
      );

      // 4️⃣ Lấy token & lưu lại
      cy.window({ timeout: 60000 })
        .should((win) => {
          expect(win.localStorage.getItem("user_token")).to.exist;
        })
        .then((win) => {
          const tokenObj = JSON.parse(win.localStorage.getItem("user_token"));
          expect(tokenObj?.access_token).to.exist;

          win.localStorage.setItem("tokenSSO", tokenObj.access_token);
        });
    },
    {
      // 5️⃣ Validate session
      validate() {
        return cy.window().then((win) => {
          const raw = win.localStorage.getItem("user_token");
          if (!raw) return false;

          const token = JSON.parse(raw)?.access_token;
          if (!token) return false;

          return cy.request({
            method: "GET",
            url: `${appOrigin}/api/management/sec-users/authority/user-info`,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false,
          }).then((res) => res.status === 200);
        });
      },
    }
  );
});
