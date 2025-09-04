import { NextResponse } from 'next/server';
import { getActiveServices } from '@/lib/airtable';
import { ApiResponse } from '@/types';

export async function GET(): Promise<NextResponse> {
  try {
    const services = await getActiveServices();
    
    return NextResponse.json({
      success: true,
      data: { services },
      message: `Found ${services.length} active services`,
    });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load services',
        message: 'Could not retrieve service definitions from database',
      },
      { status: 500 }
    );
  }
}