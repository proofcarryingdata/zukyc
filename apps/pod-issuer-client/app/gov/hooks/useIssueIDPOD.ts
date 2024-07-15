import { useMutation } from "@tanstack/react-query";
import { issuePOD, IIssuePODArgs } from "@/shared/queries/issuePOD";
import useAuthToken from "@/shared/hooks/useAuthToken";

export const useIssueIDPOD = () => {
  const { token } = useAuthToken("gov");

  return useMutation({
    mutationKey: ["issueIDPOD"],
    mutationFn: async (args: IIssuePODArgs) => {
      return issuePOD("gov", token, args);
    }
  });
};
