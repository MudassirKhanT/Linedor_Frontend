export interface Project {
  _id: string;
  title: string;
  category: "Architecture" | "Interior" | "Objects" | "Exhibition" | "video";
  subCategory: "Residential" | "Commercial" | "All" | "Lighting" | "Furniture";
  description?: string;
  images: string[];
  pdfFile?: string;

  isPrior: boolean;
  videoFile?: string;
  toHomePage: boolean;
  homePageOrder?: number;
  createdAt: string;
  updatedAt?: string;
  contactDescription?: string;
}
