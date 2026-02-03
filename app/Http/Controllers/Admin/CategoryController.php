<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Utility\FileUpload;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')
            ->latest()
            ->get();

        return inertia('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Categories/Create');
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $uploadedImage = FileUpload::uploadImage(
                $request->file('image'),
                'categories'
            );
            $data['image'] = $uploadedImage;
        }

        Category::create($data);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        return inertia('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image) {
                FileUpload::deleteImage($category->image);
            }

            $uploadedImage = FileUpload::uploadImage(
                $request->file('image'),
                'categories'
            );
            $data['image'] = $uploadedImage;
        } else {
            // Prevent overwriting existing image with null
            unset($data['image']);
        }

        $category->update($data);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        // Delete image if exists
        if ($category->image) {
            FileUpload::deleteImage($category->image);
        }

        $category->delete();

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
