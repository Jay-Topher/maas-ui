import { PowerFieldScope } from "app/store/general/types";
import type { Machine, MachineDetails } from "app/store/machine/types";
import type { Tag, TagMeta } from "app/store/tag/types";
import { NodeStatus } from "app/store/types/node";

/**
 * Whether a machine has a Machine or MachineDetails type.
 * @param machine - The machine to check
 * @returns Whether the machine is MachineDetails.
 */
export const isMachineDetails = (
  machine?: Machine | null
  // Use "metadata" as the canary as it only exists for MachineDetails.
): machine is MachineDetails => !!machine && "metadata" in machine;

export type TagIdCountMap = Map<Tag[TagMeta.PK], number>;

/**
 * The tag ids for the given machines.
 * @param machines - The machines to get the tag ids from.
 * @returns A list of tag ids.
 */
export const getTagCountsForMachines = (machines: Machine[]): TagIdCountMap => {
  const ids = machines.reduce<Tag[TagMeta.PK][]>(
    (tagIds, machine) => tagIds.concat(machine.tags),
    []
  );
  const tagCounts = new Map();
  ids.forEach((id) => {
    if (!tagCounts.has(id)) {
      tagCounts.set(id, ids.filter((tagId) => tagId === id).length);
    }
  });
  return tagCounts;
};

/**
 * Get the power field scopes that are applicable to a machine.
 * @param machine - The machine to get the applicable field scopes.
 * @returns A list of applicable field scopes.
 */
export const getMachineFieldScopes = (machine: Machine): PowerFieldScope[] => {
  if (machine.pod) {
    return [PowerFieldScope.NODE];
  }
  return [PowerFieldScope.BMC, PowerFieldScope.NODE];
};

/**
 * @returns Whether this machine is deployed and has hardware sync enabled.
 */
export function isDeployedWithHardwareSync(
  machine?: Machine | null
): machine is MachineDetails & {
  enable_hw_sync: true;
  status: NodeStatus.DEPLOYED;
} {
  return (
    isMachineDetails(machine) &&
    machine.status === NodeStatus.DEPLOYED &&
    machine.enable_hw_sync === true
  );
}

/**
 * @returns Whether this machine failed to sync when it was scheduled.
 */
export const getHasSyncFailed = (machine?: Machine | null): boolean => {
  if (!isMachineDetails(machine) || !machine.enable_hw_sync) {
    return false;
  }
  return machine.is_sync_healthy === false;
};