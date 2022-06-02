import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { extractPowerType } from "@maas-ui/maas-ui-shared";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import { useCanEdit, useSendAnalytics } from "app/base/hooks";
import controllerURLs from "app/controllers/urls";
import kvmURLs from "app/kvm/urls";
import machineURLs from "app/machines/urls";
import type { ControllerDetails } from "app/store/controller/types";
import { actions as generalActions } from "app/store/general";
import { PowerTypeNames } from "app/store/general/constants";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { getTagsDisplay } from "app/store/tag/utils";
import { nodeIsMachine } from "app/store/utils";

type Props = {
  node: ControllerDetails | MachineDetails;
};

const DetailsCard = ({ node }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const powerTypes = useSelector(powerTypesSelectors.get);
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const machineTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, node.tags)
  );
  const sendAnalytics = useSendAnalytics();
  const canEdit = useCanEdit(node, true);

  const isMachine = nodeIsMachine(node);
  const configTabUrl = isMachine
    ? machineURLs.machine.configuration({ id: node.system_id })
    : controllerURLs.controller.configuration({ id: node.system_id });
  const powerTypeDescription = powerTypes.find(
    (powerType) => powerType.name === node.power_type
  )?.description;
  const powerTypeDisplay = extractPowerType(
    powerTypeDescription || "",
    node.power_type
  );
  const tagsDisplay = getTagsDisplay(machineTags);

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <div
      className={classNames("overview-card__details", {
        "for-controller": !isMachine,
        "for-machine": isMachine,
      })}
    >
      {isMachine && (
        <div>
          <div className="u-text--muted">Owner</div>
          <span title={node.owner || "-"} data-testid="owner">
            {node.owner || "-"}
          </span>
        </div>
      )}
      <div>
        <div className="u-text--muted">Domain</div>
        <span title={node.domain?.name} data-testid="domain">
          {node.domain?.name}
        </span>
      </div>
      {isMachine && (
        <div>
          <div className="u-text--muted">Host</div>
          <span data-testid="host">
            {node.pod ? (
              <Link
                to={
                  node.power_type === PowerTypeNames.LXD
                    ? kvmURLs.lxd.single.index({ id: node.pod.id })
                    : kvmURLs.virsh.details.index({ id: node.pod.id })
                }
              >
                {node.pod.name} ›
              </Link>
            ) : (
              <em>None</em>
            )}
          </span>
        </div>
      )}
      <div data-testid="zone">
        <div>
          {canEdit ? (
            <Link
              onClick={() =>
                sendAnalytics(
                  `${node.node_type_display} details`,
                  "Zone configuration link",
                  `${node.node_type_display} summary tab`
                )
              }
              to={configTabUrl}
            >
              Zone ›
            </Link>
          ) : (
            <span className="u-text--muted">Zone</span>
          )}
        </div>
        <span title={node.zone.name}>{node.zone.name}</span>
      </div>
      {isMachine && (
        <div data-testid="resource-pool">
          <div>
            {canEdit ? (
              <Link
                onClick={() =>
                  sendAnalytics(
                    `${node.node_type_display} details`,
                    "Resource pool configuration link",
                    `${node.node_type_display} summary tab`
                  )
                }
                to={configTabUrl}
              >
                Resource pool ›
              </Link>
            ) : (
              <span className="u-text--muted">Resource pool</span>
            )}
          </div>
          <span title={node.pool.name}>{node.pool.name}</span>
        </div>
      )}
      <div>
        <div>
          {canEdit ? (
            <Link
              onClick={() =>
                sendAnalytics(
                  `${node.node_type_display} details`,
                  "Power type configuration link",
                  `${node.node_type_display} summary tab`
                )
              }
              to={configTabUrl}
            >
              Power type ›
            </Link>
          ) : (
            <span className="u-text--muted">Power type</span>
          )}
        </div>
        <span title={node.power_type} data-testid="power-type">
          {powerTypeDisplay || node.power_type || <em>None</em>}
        </span>
      </div>
      <div className="u-break-word">
        <div>
          {canEdit ? (
            <Link
              onClick={() =>
                sendAnalytics(
                  `${node.node_type_display} details`,
                  "Tags configuration link",
                  `${node.node_type_display} summary tab`
                )
              }
              to={configTabUrl}
            >
              Tags ›
            </Link>
          ) : (
            <span className="u-text--muted">Tags</span>
          )}
        </div>
        {tagsLoaded ? (
          <span data-testid="machine-tags" title={tagsDisplay}>
            {tagsDisplay}
          </span>
        ) : (
          <Spinner data-testid="loading-tags" />
        )}
      </div>
    </div>
  );
};

export default DetailsCard;
