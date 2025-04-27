"use client"; // ✅ Mark it as a client component

import { usePathname } from "next/navigation";

const PathnameProvider = ({ children }) => {
  const pathname = usePathname();

  return <>{children}</>;
};

export default PathnameProvider;