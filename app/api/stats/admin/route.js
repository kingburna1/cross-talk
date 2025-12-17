import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cross-talk-vbuj.onrender.com';

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    
    const response = await fetch(`${BACKEND_URL}/api/stats/admin`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch stats' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
