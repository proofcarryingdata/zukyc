import { useMutation } from "@tanstack/react-query";
import { issuePOD, IIssuePODArgs } from "@/shared/queries/issuePOD";
import useStore from "@/shared/hooks/useStore";

export const useIssuePaystubPOD = () => {
  const token = useStore((state) => state.deelToken);
  const setPaystubPOD = useStore((state) => state.setPaystubPOD);

  return useMutation({
    mutationKey: ["issuePaystubPOD"],
    mutationFn: async (args: IIssuePODArgs) => {
      if (!token) {
        throw new Error("Not logged in");
      }
      return issuePOD("deel", token, args);
    },
    onSuccess: (data) => {
      setPaystubPOD(data);
    },
    onError: () => {
      setPaystubPOD(null);
    }
  });
};
