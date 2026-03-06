import { NextResponse } from 'next/server';
import googleSheetService from '../../../lib/googleSheetService';

/**
 * GET /api/categories
 * Get all categories
 */
export async function GET(request) {
  try {
    const categories = await googleSheetService.getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create a new category
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Category name is required',
        },
        { status: 400 }
      );
    }

    const category = await googleSheetService.createCategory({
      name: name.trim(),
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

