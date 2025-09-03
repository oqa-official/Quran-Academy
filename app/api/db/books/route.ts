import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import Book from "@/models/book.model";

// ✅ POST (Create new book)
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const newBook = await Book.create(body);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ GET (Get all books)
export async function GET() {
  try {
    await connectToDB();
    const books = await Book.find().sort({ createdAt: -1 });
    return NextResponse.json(books, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
