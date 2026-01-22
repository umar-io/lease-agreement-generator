import Link from "next/link";
import { ReactElement } from "react";

export function Logo(): ReactElement {
  return (
    <Link
      href="/"
      className="flex items-center gap-4 text-[#111318] dark:text-white"
    >
      <div className="size-8 text-primary">
        <svg
          fill="currentColor"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
        </svg>
      </div>
      <h2 className="text-xl font-bold leading-tight tracking-tight">
        LeaseGen
      </h2>
    </Link>
  );
}
