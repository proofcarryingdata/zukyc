"use client";

import dynamic from "next/dynamic";

const page = dynamic(() => import("./app"), {
  ssr: false
});

export default page;
