import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  if (url.pathname.startsWith("/uploads/")) {
    const fileName = url.pathname.replace("/uploads/", "");
    const newUrl = new URL(`/uploads/${fileName}`, req.nextUrl.origin);
    
    return NextResponse.rewrite(newUrl);
  }
  if (url.pathname.startsWith("/logos/")) {
    const fileName = url.pathname.replace("/logos/", "");
    const newUrl = new URL(`/logos/${fileName}`, req.nextUrl.origin);
    
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}
