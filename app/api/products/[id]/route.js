import { NextResponse } from 'next/server';
import googleSheetService from '../../../../lib/googleSheetService';

/**
 * GET /api/products/:id
 * Get product by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await googleSheetService.getProductById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/:id
 * Update a product
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, categoryId, price, imageUrl, image, stock, stockStatus, description } = body;

    // Get existing product
    const existing = await googleSheetService.getProductById(id);
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Validation
    const updateData = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Product name must be a non-empty string',
          },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (categoryId !== undefined) {
      if (typeof categoryId !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Category ID must be a string',
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
      updateData.categoryId = categoryId;
    }

    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            message: 'Price must be a valid positive number',
          },
          { status: 400 }
        );
      }
      updateData.price = parseFloat(price);
    }

    if (imageUrl !== undefined || image !== undefined) {
      updateData.imageUrl = imageUrl || image || '';
    }

    if (stock !== undefined || stockStatus !== undefined) {
      updateData.stock = stock || stockStatus || existing.stock;
    }

    if (description !== undefined) {
      updateData.description = description || '';
    }

    const product = await googleSheetService.updateProduct(id, updateData);

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.message === 'Product not found') {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          message: error.message,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/:id
 * Delete a product
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const product = await googleSheetService.getProductById(id);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    await googleSheetService.deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

