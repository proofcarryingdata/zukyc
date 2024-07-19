import { useMutation } from "@tanstack/react-query";

const issueDebugIDPOD = async (args: IIssueDebugIDPODArgs) => {
  if (!process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL)
    throw new Error("NEXT_PUBLIC_POD_ISSUER_SERVER_URL not set");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL}/debug/id/issue`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...args })
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.pod;
};

export const useIssueDebugIDPOD = () => {
  return useMutation({
    mutationKey: ["issueDebugIDPOD"],
    mutationFn: async (args: IIssueDebugIDPODArgs) => {
      return issueDebugIDPOD(args);
    }
  });
};

export interface IIssueDebugIDPODArgs {
  idNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  semaphoreCommitment: string;
}
