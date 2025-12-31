# Product Images Guide

## 📁 Folder Structure

Store all product thumbnails in:
```
assets/products/
```

## 🏷️ Naming Convention

**Use product ID for filenames:**
- Format: `product-{ID}.jpg`
- Examples:
  - Product ID 1 → `product-1.jpg`
  - Product ID 2 → `product-2.jpg`
  - Product ID 50 → `product-50.jpg`

## ✅ Supported Image Formats

- `.jpg` (recommended)
- `.jpeg`
- `.png`
- `.webp`

## 📝 How to Add Product Images

### Step 1: Find the Product ID
Look in `affiliate-page.html` in the products array. Each product has an `id` property:
```javascript
{ id: 1, name: "HENRY Aluminum Roof Coating", ... }
```

### Step 2: Name Your Image File
If product ID is `1`, name your file: `product-1.jpg`

### Step 3: Save to Folder
Save the image to: `assets/products/product-1.jpg`

### Step 4: Done!
The system automatically finds the image. No code changes needed!

## 🆕 Adding New Products

When adding a new product:

1. **Add product to the array** (it will get the next available ID):
```javascript
{ id: 51, name: "New Product", desc: "...", category: "tools", link: "...", badge: null, icon: "tool" }
```

2. **Save image as**: `assets/products/product-51.jpg`

3. **That's it!** The image will automatically load.

## 🔄 Override with Custom Image Path

If you need a custom image path (not using the ID naming), you can add an `img` property:

```javascript
{ id: 1, name: "...", img: "assets/products/custom-name.jpg", ... }
```

Or use an external URL:
```javascript
{ id: 1, name: "...", img: "https://example.com/image.jpg", ... }
```

## 📋 Quick Reference: Product IDs

| ID Range | Category |
|----------|----------|
| 1-29 | Mobile Homes |
| 30-37 | Tools |
| 38-49 | Electronics |
| 50 | Land |

## 💡 Tips

- **Image Size**: Recommended 400x400px or larger (square aspect ratio works best)
- **File Size**: Keep under 200KB for fast loading
- **Naming**: Always use lowercase: `product-1.jpg` not `Product-1.JPG`
- **Missing Images**: If an image is missing, a placeholder will show automatically

## 🎯 Example Workflow

1. Download product image from Amazon/website
2. Rename to match product ID: `product-15.jpg`
3. Save to `assets/products/` folder
4. Refresh page - image appears automatically!

---

**Last Updated**: System automatically handles image paths based on product ID. No manual linking required!
