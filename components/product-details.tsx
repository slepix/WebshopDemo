"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorMessage } from "@/components/ui/error-message";
import Image from "next/image";
import { config } from "@/lib/config";

// Define the Product type
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string; // Assuming the image is a URL string
  created_at: string;
}

export default function ProductDetails({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null); // Use Product type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.api.url}/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data: Product = await response.json(); // Type the fetched data
        setProduct(data);
      } catch (err: unknown) {  // Typing 'err' as 'unknown'
        if (err instanceof Error) {  // Check if 'err' is an instance of Error
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage 
          title="Error"
          message="Failed to load product details. Please try again later."
        />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            <p className="text-2xl font-semibold">${product.price}</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-4">
            <Button size="lg" className="w-full">
              Add to Cart
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">Category</dt>
                <dd className="text-sm font-medium">{product.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Added</dt>
                <dd className="text-sm font-medium">
                  {new Date(product.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
