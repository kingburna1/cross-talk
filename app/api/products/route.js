import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cross-talk-vbuj.onrender.com/';

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    
    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch products' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to create product' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
