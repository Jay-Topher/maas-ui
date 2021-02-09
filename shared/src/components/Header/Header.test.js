import { shallow } from "enzyme";
import React from "react";

import { Header } from "./Header";

describe("Header", () => {
  let generateURL;

  beforeEach(() => {
    generateURL = (link, linkClass, appendNewBase) => (
      <a className={linkClass} href={link.url} onClick={jest.fn}>
        {link.label}
      </a>
    );
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("renders", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateLegacyLink={generateURL}
        generateNewLink={generateURL}
        location={{
          pathname: "/",
        }}
        logout={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can handle a logged out user", () => {
    const wrapper = shallow(
      <Header
        authUser={null}
        generateLegacyLink={generateURL}
        generateNewLink={generateURL}
        location={{
          pathname: "/",
        }}
        logout={jest.fn()}
      />
    );
    expect(wrapper.find("nav").exists()).toBe(false);
  });

  it("can handle logging out", () => {
    const logout = jest.fn();
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala",
        }}
        generateLegacyLink={generateURL}
        generateNewLink={generateURL}
        location={{
          pathname: "/",
        }}
        logout={logout}
      />
    );
    wrapper
      .findWhere((n) => n.name() === "a" && n.text() === "Log out")
      .last()
      .simulate("click", { preventDefault: jest.fn() });
    expect(logout).toHaveBeenCalled();
  });

  it("can show the intro flow state", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={false}
        generateLegacyLink={generateURL}
        generateNewLink={generateURL}
        location={{
          pathname: "/",
        }}
        logout={jest.fn()}
      />
    );
    expect(
      wrapper.findWhere((n) => n.name() === "a" && n.text() === "Skip").exists()
    ).toBe(true);
    expect(wrapper.find(".p-navigation__links").at(0).props().children).toBe(
      false
    );
  });

  it("can highlight a new URL", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateLegacyLink={generateURL}
        generateNewLink={generateURL}
        location={{
          pathname: "/MAAS/r/settings",
        }}
        logout={jest.fn()}
      />
    );
    const selected = wrapper.find(".p-navigation__link.is-selected");
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toEqual("Settings");
  });

  it("can highlight a legacy URL", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateLegacyLink={generateURL}
        generateNewLink={generateURL}
        location={{
          pathname: "/MAAS/l/devices",
        }}
        logout={jest.fn()}
      />
    );
    const selected = wrapper.find(".p-navigation__link.is-selected");
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toEqual("Devices");
  });

  it("can highlight a url with a query param", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateLegacyLink={generateURL}
        generateNewLink={generateURL}
        location={{
          search: "?by=fabric",
          pathname: "/MAAS/l/networks",
        }}
        logout={jest.fn()}
      />
    );
    const selected = wrapper.find(".p-navigation__link.is-selected");
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toEqual("Subnets");
  });

  it("highlights sub-urls", () => {
    const wrapper = shallow(
      <Header
        authUser={{
          is_superuser: true,
          username: "koala",
        }}
        completedIntro={true}
        generateLegacyLink={generateURL}
        generateNewLink={generateURL}
        location={{
          pathname: "/MAAS/l/machine/abc123",
        }}
        logout={jest.fn()}
      />
    );
    const selected = wrapper.find(".p-navigation__link.is-selected");
    expect(selected.exists()).toBe(true);
    expect(selected.text()).toEqual("Machines");
  });
});