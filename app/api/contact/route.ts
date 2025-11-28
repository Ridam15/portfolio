import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { submitContactForm } from '@/lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Submit to Firestore
    try {
      const submissionId = await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.company && { company: formData.company }),
      });

      // Return success response
      return NextResponse.json(
        {
          success: true,
          message: 'Contact form submitted successfully',
          submissionId,
        },
        { status: 200 }
      );
    } catch (firestoreError) {
      console.error('Firestore submission error:', firestoreError);

      // Return error response
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save contact submission',
          message: firestoreError instanceof Error ? firestoreError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Optionally handle GET requests (e.g., for health check)
export async function GET() {
  return NextResponse.json(
    {
      message: 'Contact API endpoint is operational',
      methods: ['POST'],
    },
    { status: 200 }
  );
}
