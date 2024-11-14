"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import Link from "next/link";
import { getCategories } from "@/lib/api";
import type { ApiError } from "@/lib/api";

// Define the Category interface
interface Category {
  id: string;
  name: string;
  count: number;
}

export default function CategoriesPage() {
  // Type categories as an array of Category
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError({
        message: (err as Error).message === 'Request timeout'
          ? 'Unable to connect to the server. Please check your API configuration and try again.'
          : 'Failed to load data. Please try again later.',
        isTimeout: (err as Error).message === 'Request timeout',
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage 
          title={error.isTimeout ? "Connection Error" : "Error"}
          message={error.message}
          retry={fetchCategories}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link 
              href={`/products?category=${encodeURIComponent(category.name.toLowerCase())}`} 
              key={category.id}
            >
              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription>
                    {category.count} products
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
