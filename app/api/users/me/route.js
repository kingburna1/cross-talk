import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cross-talk-vbuj.onrender.com';

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    
    const response = await fetch(`${BACKEND_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch user data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Cookie': cookieHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
