import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";

function Header() {
  const pathname: string = usePathname();

  return (
    <div className="flex flex-row items-center justify-between w-full p-3 border-b-[1px] bg-emerald-600">
      <div className="flex items-center justify-center w-full text-2xl font-semibold text-center text-secondary">
        <Image alt="logo" src="/logo-min.png" width={"60"} height="40" />
        SLP GPT
      </div>
    </div>
  );
}

export default Header;
