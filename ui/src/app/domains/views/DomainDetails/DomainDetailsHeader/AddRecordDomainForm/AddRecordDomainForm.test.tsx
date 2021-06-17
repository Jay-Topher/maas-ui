import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddRecordDomainForm from "./AddRecordDomainForm";

import { RecordType } from "app/store/domain/types/base";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddRecordDomainForm", () => {
  it("calls closeForm on cancel click", () => {
    const closeForm = jest.fn();
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "domain-in-the-brain" })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domain/1", key: "testKey" }]}
        >
          <Route
            exact
            path="/domain/:id"
            component={() => <AddRecordDomainForm closeForm={closeForm} />}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("button[data-test='cancel-action']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it("Dispatches the correct action on submit", () => {
    const closeForm = jest.fn();
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            id: 1,
            name: "domain-in-the-brain",
            resource_count: 0,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domain/1", key: "testKey" }]}
        >
          <Route
            exact
            path="/domain/:id"
            component={() => <AddRecordDomainForm closeForm={closeForm} />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").invoke("onSubmit")({
        name: "Some name",
        rrtype: RecordType.CNAME,
        rrdata: "Some data",
        ttl: 12,
      })
    );

    expect(
      store.getActions().find((action) => action.type === "domain/createRecord")
    ).toStrictEqual({
      type: "domain/createRecord",
      meta: {
        method: "create_dnsdata",
        model: "domain",
      },
      payload: {
        params: {
          domain: 1,
          name: "Some name",
          rrtype: RecordType.CNAME,
          rrdata: "Some data",
          ttl: 12,
        },
      },
    });
  });
});