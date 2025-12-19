import { NextResponse } from 'next/server';

export function middleware(request) {
  const role = request.cookies.get('role')?.value;
  const path = request.nextUrl.pathname;

  // 1. Security Check: If no role at all, force Login
  if (!role) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // 2. Define Forbidden Zones for Employees
  const employeeForbiddenPaths = [
    '/dashboard/employees',
    '/dashboard/suppliers',
    '/dashboard/analytics',
    '/dashboard/settings',
    // Add more here
  ];

  // 3. Employee Logic
  if (role === 'employee') {
    // If they try to hit a forbidden path...
    if (employeeForbiddenPaths.some(p => path.startsWith(p))) {
      // ...redirect them to their safe zone
      return NextResponse.redirect(new URL('/dashboard/salesinventorymanagement', request.url));
    }
  }

  // 4. Admin Logic (Implicit)
  // If role is 'admin', they skip the 'employee' check and pass through.
  // If role is 'employee' but the page isn't forbidden, they pass through.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
