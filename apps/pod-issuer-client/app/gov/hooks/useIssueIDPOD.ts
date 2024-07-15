import { issuePOD, IIssuePODArgs } from "@/shared/queries/issuePOD";
import { useMutation } from "@tanstack/react-query";

export const useIssueIDPOD = () => {
  // TODO: userID
  const userId = "userId";

  return useMutation({
    mutationKey: ["issueIDPOD", userId],
    mutationFn: async (args: IIssuePODArgs) => {
      return issuePOD("gov", args);
    }
  });
};
