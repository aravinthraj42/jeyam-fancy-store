import { NextResponse } from 'next/server';
import googleSheetService from '../../../../lib/googleSheetService';

/**
 * GET /api/categories/:id
 * Get category by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const category = await googleSheetService.getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/categories/:id
 * Update a category
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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

    const category = await googleSheetService.updateCategory(id, {
      name: name.trim(),
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.message === 'Category not found') {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
          message: error.message,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/:id
 * Delete a category
 * Also deletes all products in that category
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check if category exists
    const category = await googleSheetService.getCategoryById(id);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    // Check if there are products in this category
    const products = await googleSheetService.getProductsByCategory(id);
    const productCount = products.length;

    // Delete all products in this category
    if (productCount > 0) {
      await googleSheetService.deleteProductsByCategory(id);
    }

    // Delete the category
    await googleSheetService.deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: `Category and ${productCount} associated product(s) deleted successfully`,
      data: {
        deletedCategory: id,
        deletedProductsCount: productCount,
      },
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

