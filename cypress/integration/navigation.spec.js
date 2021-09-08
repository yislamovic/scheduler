describe("Navigation", () => {
  it("should visit root", () => {
    cy.request("/api/days");
    cy.request("/api/appointments");
    cy.request("/api/interviewers");
  });
  it("should navigate to Tuesday", () => {
    cy.visit("/");
    cy.get("li")
      .contains("Tuesday").click();
  });
  it("Checks CSS of <li> element 'Tuesday'", () => {
    cy.visit("/");
    cy.contains("li", "Tuesday")
      .click()
      .should("have.css", "background-color", "rgb(242, 242, 242)");
  });
});