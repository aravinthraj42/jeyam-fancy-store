import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Health check endpoint to verify API is working
 */
export async function GET() {
  try {
    // Check environment variables
    const hasEnvVars = !!(
      process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
    );

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
        hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        allEnvVarsSet: hasEnvVars,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

