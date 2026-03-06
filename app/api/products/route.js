import { NextResponse } from 'next/server';
import googleSheetService from '../../../lib/googleSheetService';

/**
 * GET /api/products
 * Get all products
 * Optional query param: categoryId (filter by category)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    let products = await googleSheetService.getProducts();

    // Filter by category if provided
    if (categoryId) {
      products = products.filter((p) => p.categoryId === categoryId);
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, categoryId, price, imageUrl, image, stock, stockStatus, description } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Product name is required',
        },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Category ID is required',
        },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await googleSheetService.getCategoryById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Category not found',
        },
        { status: 400 }
      );
    }

    if (!price || isNaN(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Valid price is required',
        },
        { status: 400 }
      );
    }

    const product = await googleSheetService.createProduct({
      name: name.trim(),
      categoryId,
      price: parseFloat(price),
      imageUrl: imageUrl || image || '',
      stock: stock || stockStatus || 'In Stock',
      description: description || '',
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

