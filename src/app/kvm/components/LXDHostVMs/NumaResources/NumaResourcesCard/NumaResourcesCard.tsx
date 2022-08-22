import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import CoreResources from "app/kvm/components/CoreResources";
import RamResources from "app/kvm/components/RamResources";
import VfResources from "app/kvm/components/VfResources";
import VmResources from "app/kvm/components/VmResources";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod, PodNetworkInterface, PodNuma } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

export const TRUNCATION_POINT = 4;

type Props = { numaId: PodNuma["node_id"]; podId: Pod["id"] };

const NumaResourcesCard = ({ numaId, podId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, podId)
  );
  const podVMs = useSelector((state: RootState) =>
    podSelectors.getVMs(state, podId)
  );
  const machinesLoading = useSelector(machineSelectors.loading);

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    const { resources } = pod;
    const numa = resources.numa.find((numa) => numa.node_id === numaId);
    if (!!numa) {
      const { hpAllocated, hpFree, pageSize } = numa.memory.hugepages.reduce(
        ({ hpAllocated, hpFree, pageSize }, hp) => {
          if (!pageSize) {
            // Only the first hugepage page_size is used because as of MAAS 3.0
            // different page sizes aren't supported. This may change in the
            // future.
            pageSize = hp.page_size;
          }
          hpAllocated += hp.allocated;
          hpFree += hp.free;
          return { hpAllocated, hpFree, pageSize };
        },
        { hpAllocated: 0, hpFree: 0, pageSize: 0 }
      );
      // NUMA interfaces and VMs only provide a reference ID, so we need to
      // retrieve the interface resource and full VM data.
      const numaInterfaces = numa.interfaces.reduce<PodNetworkInterface[]>(
        (numaInterfaces, ifaceId) => {
          const ifaceResource = resources.interfaces.find(
            (iface) => iface.id === ifaceId
          );
          if (ifaceResource) {
            numaInterfaces.push(ifaceResource);
          }
          return numaInterfaces;
        },
        []
      );
      const numaVms = numa.vms.reduce<Machine[]>((numaVms, vmId) => {
        const vmResource = resources.vms.find((vm) => vm.id === vmId);
        if (vmResource) {
          const numaVm = podVMs.find(
            (podVm) => podVm.system_id === vmResource.system_id
          );
          if (numaVm) {
            numaVms.push(numaVm);
          }
        }
        return numaVms;
      }, []);

      return (
        <div className="numa-resources-card">
          <h5 className="numa-resources-card__title p-text--paragraph u-no-max-width">
            NUMA node {numa.node_id}
          </h5>
          <RamResources
            generalAllocated={numa.memory.general.allocated}
            generalFree={numa.memory.general.free}
            hugepagesAllocated={hpAllocated}
            hugepagesFree={hpFree}
            pageSize={pageSize}
          />
          <CoreResources
            allocated={numa.cores.allocated}
            free={numa.cores.free}
          />
          <VfResources interfaces={numaInterfaces} />
          <VmResources loading={machinesLoading} vms={numaVms} />
        </div>
      );
    }
  }
  return <Spinner text="Loading" />;
};

export default NumaResourcesCard;