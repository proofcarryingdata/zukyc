export const issuePOD = async (
  podType: string,
  token: string,
  args: IIssuePODArgs
) => {
  if (!process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL)
    throw new Error("NEXT_PUBLIC_POD_ISSUER_SERVER_URL not set");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_POD_ISSUER_SERVER_URL}/${podType}/issue`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...args })
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.pod;
};

export interface IIssuePODArgs {
  semaphoreCommitment: string;
}
