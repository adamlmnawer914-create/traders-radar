import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirectUrl = new URL("/dashboard", url.origin);
  const response = NextResponse.redirect(redirectUrl);
  
  response.cookies.set("traders_demo_session", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });
  
  return response;
}

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true, redirect: "/dashboard" });
  
  response.cookies.set("traders_demo_session", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });
  
  return response;
}