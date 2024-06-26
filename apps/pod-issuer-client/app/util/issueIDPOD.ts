import { Dispatch } from "react";

export async function issueIDPOD(
  args: IIssueIDPODArgs,
  setResponse: Dispatch<IIssueIDPODResponse>
) {
  try {
    // TODO: should not hard code this url
    const response = await fetch("http://localhost:3003/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...args })
    });
    const data = await response.json();

    setResponse({
      success: true,
      serializedPOD: data.pod
    });
  } catch (e) {
    setResponse({
      success: false,
      error: (e as Error).message
    });
  }
}

export interface IIssueIDPODArgs {
  firstName: string;
  lastName: string;
  age: string;
  semaphoreCommitment: string;
}

export type IIssueIDPODResponse =
  | {
      success: true;
      error?: never;
      serializedPOD: string;
    }
  | { success: false; error: string; serializedPOD?: never };
