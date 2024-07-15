import { useMutation } from "@tanstack/react-query";
import { issuePOD, IIssuePODArgs } from "@/shared/queries/issuePOD";
import useAuthToken from "@/shared/hooks/useAuthToken";

export const useIssuePaystubPOD = () => {
  const { token } = useAuthToken("deel");

  return useMutation({
    mutationKey: ["issuePaystubPOD"],
    mutationFn: async (args: IIssuePODArgs) => {
      return issuePOD("deel", token, args);
    }
  });
};
