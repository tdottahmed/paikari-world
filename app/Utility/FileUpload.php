<?php

namespace App\Utility;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class FileUpload
{
  /**
   * Upload multiple images and return only original paths (Simple version)
   *
   * @param array $files
   * @param string $folder
   * @param string $disk
   * @return array
   */
  public static function uploadImages(array $files, string $folder = 'products', string $disk = 'public'): array
  {
    $uploadedImages = [];

    foreach ($files as $file) {
      $uploadedImages[] = self::uploadImage($file, $folder, $disk);
    }
    return $uploadedImages;
  }

  /**
   * Upload single image and return only original path (Simple version)
   *
   * @param UploadedFile $file
   * @param string $folder
   * @param string $disk
   * @return string
   */
  public static function uploadImage(UploadedFile $file, string $folder = 'products', string $disk = 'public'): string
  {
    $fileName = self::generateFileName($file);

    // Store only original file
    $filePath = $file->storeAs($folder, $fileName, $disk);

    return $filePath;
  }

  /**
   * Upload multiple images with various sizes (Advanced version for future use)
   *
   * @param array $files
   * @param string $folder
   * @param array $sizes
   * @param string $disk
   * @return array
   */
  public static function uploadImagesWithSizes(array $files, string $folder = 'products', array $sizes = [], string $disk = 'public'): array
  {
    $uploadedImages = [];

    foreach ($files as $file) {
      $uploadedImages[] = self::uploadImageWithSizes($file, $folder, $sizes, $disk);
    }

    return $uploadedImages;
  }

  /**
   * Upload single image with various sizes (Advanced version for future use)
   *
   * @param UploadedFile $file
   * @param string $folder
   * @param array $sizes
   * @param string $disk
   * @return array
   */
  public static function uploadImageWithSizes(UploadedFile $file, string $folder = 'products', array $sizes = [], string $disk = 'public'): array
  {
    // Default sizes if none provided
    if (empty($sizes)) {
      $sizes = [
        'original' => [null, null],
        'large' => [1200, 1200],
        'medium' => [600, 600],
        'small' => [300, 300],
        'thumbnail' => [150, 150],
      ];
    }

    $fileName = self::generateFileName($file);
    $uploadedPaths = [];

    foreach ($sizes as $sizeName => $dimensions) {
      $path = $folder . '/' . $sizeName;

      if ($sizeName === 'original') {
        // Store original file
        $filePath = $file->storeAs($path, $fileName, $disk);
        $uploadedPaths[$sizeName] = $filePath;
      } else {
        [$width, $height] = $dimensions;
        $image = Image::make($file);

        $image->resize($width, $height, function ($constraint) {
          $constraint->aspectRatio();
          $constraint->upsize();
        });

        $encodedImage = $image->encode($file->getClientOriginalExtension());
        $filePath = $path . '/' . $fileName;

        Storage::disk($disk)->put($filePath, $encodedImage->__toString());
        $uploadedPaths[$sizeName] = $filePath;
      }
    }

    return $uploadedPaths;
  }

  /**
   * Generate unique file name
   *
   * @param UploadedFile $file
   * @return string
   */
  private static function generateFileName(UploadedFile $file): string
  {
    $extension = strtolower($file->getClientOriginalExtension());
    $originalName = $file->getClientOriginalName();
    $baseName = pathinfo($originalName, PATHINFO_FILENAME);
    $slug = Str::slug($baseName, '-');
    if (empty($slug)) {
      $slug = 'file';
    }
    $unique = now()->format('YmdHis') . '_' . Str::random(6);
    return "{$slug}_{$unique}.{$extension}";
  }


  /**
   * Delete images from storage using paths array
   *
   * @param array $imagePaths - Array of image paths (simple strings or arrays)
   * @param string $disk
   * @return bool
   */
  public static function deleteImages(array $imagePaths, string $disk = 'public'): bool
  {
    try {
      foreach ($imagePaths as $path) {
        // Handle both simple paths and multi-size path arrays
        if (is_array($path)) {
          foreach ($path as $singlePath) {
            if (Storage::disk($disk)->exists($singlePath)) {
              Storage::disk($disk)->delete($singlePath);
            }
          }
        } else {
          if (Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
          }
        }
      }
      return true;
    } catch (\Exception $e) {
      return false;
    }
  }

  /**
   * Validate image files
   *
   * @param array $files
   * @param int $maxSize // in KB
   * @param array $allowedMimes
   * @return array
   */
  public static function validateImages(array $files, int $maxSize = 5120, array $allowedMimes = ['jpg', 'jpeg', 'png', 'gif', 'webp']): array
  {
    $errors = [];

    foreach ($files as $key => $file) {
      // Check file size
      if ($file->getSize() > $maxSize * 1024) {
        $errors[] = "File {$file->getClientOriginalName()} is too large. Maximum size is " . ($maxSize / 1024) . "MB.";
      }

      // Check MIME type
      $extension = strtolower($file->getClientOriginalExtension());
      if (!in_array($extension, $allowedMimes)) {
        $errors[] = "File {$file->getClientOriginalName()} has invalid type. Allowed types: " . implode(', ', $allowedMimes);
      }

      // Check if image is valid
      if (!@getimagesize($file->getPathname())) {
        $errors[] = "File {$file->getClientOriginalName()} is not a valid image.";
      }
    }

    return $errors;
  }

  /**
   * Get full URL for an image path
   *
   * @param string $path
   * @param string $disk
   * @return string
   */
  public static function getImageUrl(string $path, string $disk = 'public'): string
  {
    return Storage::disk($disk)->path($path);
  }

  /**
   * Get full URLs for all image sizes (for multi-size images)
   *
   * @param array $paths
   * @param string $disk
   * @return array
   */
  public static function getImageUrls(array $paths, string $disk = 'public'): array
  {
    $urls = [];
    foreach ($paths as $size => $path) {
      $urls[$size] = Storage::disk($disk)->path($path);
    }
    return $urls;
  }
  /**
   * Delete single image from storage
   *
   * @param string $imagePath
   * @param string $disk
   * @return bool
   */
  public static function deleteImage(string $imagePath, string $disk = 'public'): bool
  {
    try {
      if (Storage::disk($disk)->exists($imagePath)) {
        Storage::disk($disk)->delete($imagePath);
      }
      return true;
    } catch (\Exception $e) {
      return false;
    }
  }
}
