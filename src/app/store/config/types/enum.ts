export enum AutoIpmiPrivilegeLevel {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  USER = "USER",
}

export enum ConfigMeta {
  MODEL = "config",
}

export enum ConfigNames {
  ACTIVE_DISCOVERY_INTERVAL = "active_discovery_interval",
  BOOT_IMAGES_AUTO_IMPORT = "boot_images_auto_import",
  BOOT_IMAGES_NO_PROXY = "boot_images_no_proxy",
  COMMISSIONING_DISTRO_SERIES = "commissioning_distro_series",
  COMPLETED_INTRO = "completed_intro",
  CURTIN_VERBOSE = "curtin_verbose",
  DEFAULT_DISTRO_SERIES = "default_distro_series",
  DEFAULT_DNS_TTL = "default_dns_ttl",
  DEFAULT_MIN_HWE_KERNEL = "default_min_hwe_kernel",
  DEFAULT_OSYSTEM = "default_osystem",
  DEFAULT_STORAGE_LAYOUT = "default_storage_layout",
  DISK_ERASE_WITH_QUICK_ERASE = "disk_erase_with_quick_erase",
  DISK_ERASE_WITH_SECURE_ERASE = "disk_erase_with_secure_erase",
  DNS_TRUSTED_ACL = "dns_trusted_acl",
  DNSSEC_VALIDATION = "dnssec_validation",
  ENABLE_ANALYTICS = "enable_analytics",
  ENABLE_DISK_ERASING_ON_RELEASE = "enable_disk_erasing_on_release",
  ENABLE_HTTP_PROXY = "enable_http_proxy",
  ENABLE_THIRD_PARTY_DRIVERS = "enable_third_party_drivers",
  ENLIST_COMMISSIONING = "enlist_commissioning",
  FORCE_V1_NETWORK_YAML = "force_v1_network_yaml",
  HARDWARE_SYNC_INTERVAL = "hardware_sync_interval",
  HTTP_PROXY = "http_proxy",
  KERNEL_OPTS = "kernel_opts",
  MAAS_AUTO_IPMI_CIPHER_SUITE_ID = "maas_auto_ipmi_cipher_suite_id",
  MAAS_AUTO_IPMI_K_G_BMC_KEY = "maas_auto_ipmi_k_g_bmc_key",
  MAAS_AUTO_IPMI_USER = "maas_auto_ipmi_user",
  MAAS_AUTO_IPMI_USER_PRIVILEGE_LEVEL = "maas_auto_ipmi_user_privilege_level",
  MAAS_AUTO_IPMI_WORKAROUND_FLAGS = "maas_auto_ipmi_workaround_flags",
  MAAS_INTERNAL_DOMAIN = "maas_internal_domain",
  MAAS_NAME = "maas_name",
  MAAS_PROXY_PORT = "maas_proxy_port",
  MAAS_SYSLOG_PORT = "maas_syslog_port",
  MAAS_URL = "maas_url",
  MAX_NODE_COMMISSIONING_RESULTS = "max_node_commissioning_results",
  MAX_NODE_INSTALLATION_RESULTS = "max_node_installation_results",
  MAX_NODE_TESTING_RESULTS = "max_node_testing_results",
  NETWORK_DISCOVERY = "network_discovery",
  NODE_TIMEOUT = "node_timeout",
  NTP_EXTERNAL_ONLY = "ntp_external_only",
  NTP_SERVERS = "ntp_servers",
  PREFER_V4_PROXY = "prefer_v4_proxy",
  PROMETHEUS_ENABLED = "prometheus_enabled",
  PROMETHEUS_PUSH_GATEWAY = "prometheus_push_gateway",
  PROMETHEUS_PUSH_INTERVAL = "prometheus_push_interval",
  PROMTAIL_ENABLED = "promtail_enabled",
  PROMTAIL_PORT = "promtail_port",
  RELEASE_NOTIFICATIONS = "release_notifications",
  REMOTE_SYSLOG = "remote_syslog",
  RPC_SHARED_SECRET = "rpc_shared_secret",
  SUBNET_IP_EXHAUSTION_THRESHOLD_COUNT = "subnet_ip_exhaustion_threshold_count",
  THEME = "theme",
  TLS_CERT_EXPIRATION_NOTIFICATION_ENABLED = "tls_cert_expiration_notification_enabled",
  TLS_CERT_EXPIRATION_NOTIFICATION_INTERVAL = "tls_cert_expiration_notification_interval",
  UPSTREAM_DNS = "upstream_dns",
  USE_PEER_PROXY = "use_peer_proxy",
  USE_RACK_PROXY = "use_rack_proxy",
  UUID = "uuid",
  VCENTER_DATACENTER = "vcenter_datacenter",
  VCENTER_PASSWORD = "vcenter_password",
  VCENTER_SERVER = "vcenter_server",
  VCENTER_USERNAME = "vcenter_username",
  WINDOWS_KMS_HOST = "windows_kms_host",
}

export enum NetworkDiscovery {
  DISABLED = "disabled",
  ENABLED = "enabled",
}

export enum TLSExpiryNotificationInterval {
  MIN = 1,
  MAX = 90,
}
