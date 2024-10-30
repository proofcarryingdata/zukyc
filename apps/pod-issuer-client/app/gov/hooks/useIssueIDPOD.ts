import { useMutation } from "@tanstack/react-query";
import { issuePOD, IIssuePODArgs } from "@/shared/queries/issuePOD";
import useStore from "@/shared/hooks/useStore";

export const useIssueIDPOD = () => {
  const token = useStore((state) => state.govToken);
  const setIdPOD = useStore((state) => state.setIdPOD);

  return useMutation({
    mutationKey: ["issueIDPOD"],
    mutationFn: async (args: IIssuePODArgs) => {
      if (!token) {
        throw new Error("Not logged in");
      }
      return issuePOD("gov", token, args);
    },
    onMutate: () => {
      setIdPOD(null);
    },
    onSuccess: (data) => {
      setIdPOD(data);
    }
  });
};
