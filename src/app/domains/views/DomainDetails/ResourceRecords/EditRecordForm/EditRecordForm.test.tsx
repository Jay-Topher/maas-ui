import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import EditRecordForm, {
  Labels as EditRecordFormLabels,
} from "./EditRecordForm";

import { Labels as RecordFieldsLabels } from "app/domains/components/RecordFields/RecordFields";
import { actions as domainActions } from "app/store/domain";
import { RecordType } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";
import {
  domainDetails as domainFactory,
  domainState as domainStateFactory,
  domainResource as resourceFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("EditRecordForm", () => {
  let state: RootState;
  const resourceA = resourceFactory({
    dnsdata_id: null,
    dnsresource_id: 11,
    name: "test-resource-A",
    rrdata: "0.0.0.0",
    rrtype: RecordType.A,
  });
  const resourceTXT = resourceFactory({
    dnsdata_id: 22,
    dnsresource_id: 33,
    name: "test-resource-TXT",
    rrdata: "testing",
    rrtype: RecordType.TXT,
  });

  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            id: 1,
            name: "test",
            rrsets: [resourceA, resourceTXT],
          }),
        ],
      }),
    });
  });

  it("closes the form when Cancel button is clicked", async () => {
    const closeForm = jest.fn();

    renderWithBrowserRouter(
      <EditRecordForm closeForm={closeForm} id={1} resource={resourceA} />,
      { wrapperProps: { state } }
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(closeForm).toHaveBeenCalled();
  });

  it("dispatches an action to update the record", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <EditRecordForm closeForm={jest.fn()} id={1} resource={resourceA} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const data_box = screen.getByRole("textbox", {
      name: RecordFieldsLabels.Data,
    });

    await userEvent.clear(data_box);
    await userEvent.type(data_box, "testing");

    await userEvent.type(
      screen.getByRole("spinbutton", { name: RecordFieldsLabels.Ttl }),
      "42"
    );

    await userEvent.click(
      screen.getByRole("button", { name: EditRecordFormLabels.SubmitLabel })
    );

    const expectedAction = domainActions.updateRecord({
      domain: 1,
      name: resourceA.name,
      rrdata: "testing",
      rrset: resourceA,
      ttl: 42,
    });

    const actualAction = store
      .getActions()
      .find((action) => action.type === "domain/updateRecord");
    expect(actualAction).toStrictEqual(expectedAction);
  });
});