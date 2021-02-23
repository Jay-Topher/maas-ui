import type { RouterState } from "connected-react-router";

import type { ConfigState } from "app/store/config/types";
import type { ControllerState } from "app/store/controller/types";
import type { DeviceState } from "app/store/device/types";
import type { DHCPSnippetState } from "app/store/dhcpsnippet/types";
import type { DomainState } from "app/store/domain/types";
import type { FabricState } from "app/store/fabric/types";
import type { GeneralState } from "app/store/general/types";
import type { LicenseKeysState } from "app/store/licensekeys/types";
import type { MachineState } from "app/store/machine/types";
import type { MessageState } from "app/store/message/types";
import type { NodeDeviceState } from "app/store/nodedevice/types";
import type { NodeScriptResultState } from "app/store/nodescriptresult/types";
import type { NotificationState } from "app/store/notification/types";
import type { PackageRepositoryState } from "app/store/packagerepository/types";
import type { PodState } from "app/store/pod/types";
import type { ResourcePoolState } from "app/store/resourcepool/types";
import type { ScriptResultState } from "app/store/scriptresult/types";
import type { ScriptsState } from "app/store/scripts/types";
import type { ServiceState } from "app/store/service/types";
import type { SpaceState } from "app/store/space/types";
import type { SSHKeyState } from "app/store/sshkey/types";
import type { SSLKeyState } from "app/store/sslkey/types";
import type { StatusState } from "app/store/status/types";
import type { SubnetState } from "app/store/subnet/types";
import type { TagState } from "app/store/tag/types";
import type { TokenState } from "app/store/token/types";
import type { UserState } from "app/store/user/types";
import type { VLANState } from "app/store/vlan/types";
import type { ZoneState } from "app/store/zone/types";

export type RootState = {
  config: ConfigState;
  controller: ControllerState;
  device: DeviceState;
  dhcpsnippet: DHCPSnippetState;
  domain: DomainState;
  fabric: FabricState;
  general: GeneralState;
  licensekeys: LicenseKeysState;
  machine: MachineState;
  messages: MessageState;
  nodedevice: NodeDeviceState;
  nodescriptresult: NodeScriptResultState;
  notification: NotificationState;
  packagerepository: PackageRepositoryState;
  pod: PodState;
  resourcepool: ResourcePoolState;
  router?: RouterState;
  scriptresult: ScriptResultState;
  scripts: ScriptsState;
  service: ServiceState;
  space: SpaceState;
  sshkey: SSHKeyState;
  sslkey: SSLKeyState;
  status: StatusState;
  subnet: SubnetState;
  tag: TagState;
  token: TokenState;
  user: UserState;
  vlan: VLANState;
  zone: ZoneState;
};