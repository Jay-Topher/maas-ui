import { generateId, generateMAASURL, generateVid } from "../../utils";

context("Subnets - Add", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/networks?by=fabric"));
    cy.viewport("macbook-11");
  });

  const openAddForm = (name: string) => {
    cy.findByRole("button", { name: "Add" }).click();
    cy.findByRole("button", { name }).click();
  };

  const submitForm = (formName: string) => {
    cy.findByRole("button", { name: `Add ${formName}` }).click();
  };

  const completeAddVlanForm = (
    vid: string,
    name: string,
    fabricName?: string,
    spaceName?: string
  ) => {
    openAddForm("VLAN");
    cy.findByRole("textbox", { name: "VID" }).type(vid);
    cy.findByRole("combobox", { name: "Fabric" }).select(fabricName || 1);
    cy.findByRole("combobox", { name: "Space" }).select(spaceName || 1);
    cy.findByRole("textbox", { name: "Name" }).type(name);
    cy.findByRole("button", { name: "Add VLAN" }).click();
  };

  const completeForm = (formName: string, name: string) => {
    openAddForm(formName);
    cy.findByRole("textbox", { name: "Name (optional)" }).type(name);
    submitForm(formName);
  };

  it("can add and delete a new fabric", () => {
    const name = `cypress-${generateId()}`;
    completeForm("Fabric", name);

    cy.findByRole("grid", { name: /Subnets/i }).within(() => {
      cy.findByRole("link", { name }).click();
    });

    cy.url().should("include", generateMAASURL("/fabric"));

    cy.findByRole("button", { name: "Delete fabric" }).click();

    cy.findByText("Are you sure you want to delete this fabric?").should(
      "be.visible"
    );

    cy.findByRole("complementary", { name: /Delete fabric/i }).within(() =>
      cy.findByRole("button", { name: "Delete fabric" }).click()
    );

    cy.url().should("include", generateMAASURL("/networks?by=fabric"));

    cy.findByRole("grid", { name: /Subnets/i }).within(() => {
      cy.findByRole("link", { name }).should("not.exist");
    });
  });

  it("can add and delete a new space", () => {
    cy.visit(generateMAASURL("/networks?by=space"));
    const name = `cypress-${generateId()}`;
    completeForm("Space", name);
    cy.findByRole("grid", { name: /Subnets/ }).within(() => {
      cy.findByRole("link", { name }).click();
    });

    cy.url().should("include", generateMAASURL("/space"));

    cy.findByRole("button", { name: "Delete space" }).click();

    cy.findByText(`Are you sure you want to delete this space?`).should(
      "be.visible"
    );

    cy.findByRole("complementary", { name: /Delete space/i }).within(() =>
      cy.findByRole("button", { name: "Delete space" }).click()
    );

    cy.url().should("include", generateMAASURL("/networks?by=fabric"));
    cy.findByRole("grid", { name: /Subnets/ }).within(() => {
      cy.findByRole("link", { name }).should("not.exist");
    });
  });

  it("can add and delete a new subnet", () => {
    const fabric = `cy-fabric-${generateId()}`;
    const spaceName = `cy-space-${generateId()}`;
    const vid = generateVid();
    const vlan = `cy-vlan-${vid}`;
    const cidr = "192.168.122.18";
    const subnetName = `cy-subnet-${generateId()}`;

    completeForm("Fabric", fabric);
    completeForm("Space", spaceName);
    completeAddVlanForm(vid, vlan, fabric, spaceName);
    cy.addSubnet({ subnetName, cidr, fabric, vid, vlan });

    cy.findAllByRole("link", { name: fabric }).should("have.length", 2);

    // Check it groups items added to the same fabric correctly
    cy.findAllByRole("row", { name: fabric })
      .eq(1)
      .within(() => {
        cy.findAllByRole("gridcell")
          .eq(1)
          .should("have.text", `${vid} (${vlan})`);
        cy.findAllByRole("gridcell").eq(3).should("contain.text", subnetName);
        cy.findAllByRole("gridcell").eq(5).should("have.text", spaceName);
      });

    // delete the subnet
    cy.findByRole("link", { name: new RegExp(subnetName) }).click();
    cy.findByRole("button", { name: "Take action" }).click();
    cy.findByRole("button", { name: "Delete subnet" }).click();
    cy.findByText(/Are you sure you want to delete this subnet?/).should(
      "be.visible"
    );
    cy.findByRole("button", { name: "Delete" }).click();

    cy.url().should("include", generateMAASURL("/networks?by=fabric"));
    cy.findByRole("link", { name: new RegExp(subnetName) }).should("not.exist");
  });

  it("displays an error when trying to add a VLAN with a VID that already exists", () => {
    const vid = generateVid();
    const name = `cypress-${vid}`;
    completeAddVlanForm(vid, name);
    completeAddVlanForm(vid, name);
    cy.findByText(
      /A VLAN with the specified VID already exists in the destination fabric./
    ).should("exist");
  });

  it(`displays an error when trying to add a Fabric with a name that already exists`, () => {
    const name = `cypress-${generateId()}`;
    completeForm("Fabric", name);
    completeForm("Fabric", name);
    cy.findByText(/this Name already exists/).should("be.visible");
  });

  it(`displays an error when trying to add a Space with a name that already exists`, () => {
    const name = `cypress-${generateId()}`;
    completeForm("Space", name);
    completeForm("Space", name);
    cy.findByText(/this Name already exists/).should("be.visible");
  });
});
