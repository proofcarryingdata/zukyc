"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="my-3">Welcome to Zukyc!</h1>
      <ul>
        <li>
          <Link href={"/prover"}>GPC prover</Link>
        </li>
      </ul>
      <br />
    </main>
  );
}
