import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import CloneForm from "./CloneForm";

import { actions as machineActions } from "app/store/machine";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CloneForm", () => {
  it("can dispatch an action to clone to selected machines in the machine list", () => {
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
      machineFactory({ system_id: "ghi789" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: machines,
        loaded: true,
        selected: ["abc123", "def456"],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
          ghi789: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CloneForm clearSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("Formik").invoke("onSubmit")({
      interfaces: true,
      source: "ghi789",
      storage: false,
    });

    const expectedAction = machineActions.clone({
      destinations: ["abc123", "def456"],
      interfaces: true,
      storage: false,
      system_id: "ghi789",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(expectedAction).toStrictEqual(actualAction);
  });

  it("can dispatch an action to clone to the active machine", () => {
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: machines[0].system_id,
        items: machines,
        loaded: true,
        selected: [],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <CloneForm clearSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("Formik").invoke("onSubmit")({
      interfaces: true,
      source: "def456",
      storage: false,
    });

    const expectedAction = machineActions.clone({
      destinations: ["abc123"],
      interfaces: true,
      storage: false,
      system_id: "def456",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(expectedAction).toStrictEqual(actualAction);
  });
});