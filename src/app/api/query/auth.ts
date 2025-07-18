import type { Options } from "@hey-api/client-fetch";
import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type {
  CompleteIntroData,
  CompleteIntroError,
  CompleteIntroResponse,
  GetMeWithSummaryData,
  GetMeWithSummaryError,
  GetMeWithSummaryResponse,
  LoginData,
  LoginError,
  LoginResponse,
} from "@/app/apiclient";
import {
  completeIntroMutation,
  getMeWithSummaryOptions,
  getMeWithSummaryQueryKey,
  loginMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useAuthenticate = (mutationOptions?: Options<LoginData>) => {
  return useMutation<LoginResponse, LoginError, Options<LoginData>>({
    ...loginMutation(mutationOptions),
  });
};

export const useGetCurrentUser = (
  options?: Options<GetMeWithSummaryData>,
  queryOptions?: UseQueryOptions<
    GetMeWithSummaryData,
    GetMeWithSummaryError,
    GetMeWithSummaryResponse
  >
) => {
  return useWebsocketAwareQuery({
    ...(getMeWithSummaryOptions(options) as UseQueryOptions<
      GetMeWithSummaryData,
      GetMeWithSummaryError,
      GetMeWithSummaryResponse
    >),
    ...queryOptions,
  });
};

export const useGetIsSuperUser = (options?: Options<GetMeWithSummaryData>) => {
  return useWebsocketAwareQuery({
    ...getMeWithSummaryOptions(options),
    select: (data) => data.is_superuser,
  } as UseQueryOptions<
    GetMeWithSummaryResponse,
    GetMeWithSummaryError,
    boolean
  >);
};

export const useCompleteIntro = (
  mutationOptions?: Options<CompleteIntroData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CompleteIntroResponse,
    CompleteIntroError,
    Options<CompleteIntroData>
  >({
    ...completeIntroMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getMeWithSummaryQueryKey(),
      });
    },
  });
};
