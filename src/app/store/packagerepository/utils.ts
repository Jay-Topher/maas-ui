import type { PackageRepositoryResponse } from "@/app/apiclient";

/**
 * Map repositories to names.
 * @param repo - A repository
 * @return The mapped name.
 */
export const getRepoDisplayName = (
  name: PackageRepositoryResponse["name"]
): string => {
  if (name === "main_archive") {
    return "Ubuntu archive";
  } else if (name === "ports_archive") {
    return "Ubuntu extra architectures";
  }
  return name;
};

/**
 * Checks if a package repository is a default repository.
 * @param repo A package repository
 * @returns `true` if the repository is a default repository, `false` otherwise.
 */
export const getIsDefaultRepo = (repo: PackageRepositoryResponse): boolean =>
  repo.name === "main_archive" || repo.name === "ports_archive";
