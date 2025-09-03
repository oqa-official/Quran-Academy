import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import Book from "@/models/book.model";
import { v2 as cloudinary } from "cloudinary";

// ✅ Configure cloudinary (server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});


// ✅ GET by ID
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT (Update book by ID)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;
    const body = await req.json();

    const prevBook = await Book.findById(id);
    if (!prevBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // 1️⃣ Image cleanup if changed
    if (body.coverImage && body.coverImage !== prevBook.coverImage) {
      if (
        prevBook.coverImage?.startsWith("https://res.cloudinary.com") &&
        prevBook.cloudinaryImageId
      ) {
        try {
          await cloudinary.uploader.destroy(prevBook.cloudinaryImageId);
          console.log("🗑️ Old Cloudinary image deleted");
        } catch (err) {
          console.error("⚠️ Failed to delete old image:", err);
        }
      }
    }

    // 2️⃣ PDF cleanup if changed
    if (body.pdfUrl && body.pdfUrl !== prevBook.pdfUrl) {
      if (
        prevBook.pdfUrl?.startsWith("https://res.cloudinary.com") &&
        prevBook.cloudinaryPdfId
      ) {
        try {
          await cloudinary.uploader.destroy(prevBook.cloudinaryPdfId, {
            resource_type: "raw", // ✅ required for non-images like PDFs
          });
          console.log("🗑️ Old Cloudinary PDF deleted");
        } catch (err) {
          console.error("⚠️ Failed to delete old PDF:", err);
        }
      }
    }

    // 3️⃣ Update book
    const updatedBook = await Book.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE (Remove book by ID)
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // 1️⃣ Delete Cloudinary image
    if (
      book.coverImage &&
      book.coverImage.startsWith("https://res.cloudinary.com") &&
      book.cloudinaryImageId
    ) {
      try {
        await cloudinary.uploader.destroy(book.cloudinaryImageId);
        console.log("🗑️ Cloudinary image deleted:", book.cloudinaryImageId);
      } catch (err) {
        console.error("⚠️ Failed to delete image:", err);
      }
    }

    // 2️⃣ Delete Cloudinary PDF
    if (
      book.pdfUrl &&
      book.pdfUrl.startsWith("https://res.cloudinary.com") &&
      book.cloudinaryPdfId
    ) {
      try {
        await cloudinary.uploader.destroy(book.cloudinaryPdfId, {
          resource_type: "raw",
        });
        console.log("🗑️ Cloudinary PDF deleted:", book.cloudinaryPdfId);
      } catch (err) {
        console.error("⚠️ Failed to delete PDF:", err);
      }
    }

    // 3️⃣ Delete book document
    await Book.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 Delete Book Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
