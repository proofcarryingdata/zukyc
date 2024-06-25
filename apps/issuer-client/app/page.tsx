"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="my-3">Welcome to Zukyc!</h1>
      <ul>
        <li>
          <Link href={"/id-pod-issuer"}>ID POD issuer</Link>
        </li>
      </ul>
      <br />
    </main>
  );
}
