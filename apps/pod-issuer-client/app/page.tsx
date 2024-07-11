"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 flex flex-col gap-8">
      <h1 className="text-xl font-bold">POD Issuers</h1>
      <ul>
        <li>
          <Link href={"/gov"}>ZooGov - Govenment ID POD issuer</Link>
        </li>
        <li>
          <Link href={"/deel"}>ZooDeel - Paystub POD issuer</Link>
        </li>
        <li>
          <Link href={"/debug"}>ZooAdmin - For debugging</Link>
        </li>
      </ul>
      <br />
    </main>
  );
}
