export interface Book {
  _id: string;
  name: string;
  author: string;
  coverImage: string;
  pdfUrl: string;
  description?: string;
  category?: string;
}