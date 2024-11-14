"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorMessage } from "@/components/ui/error-message";
import Image from "next/image";
import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/api";
import type { ApiError } from "@/lib/api";

// Define a type for the category object
type Category = {
  id: string; // or number depending on your data
  name: string;
  count: number;
};

// Define a type for the product object
type Product = {
  id: string; // or number depending on your data
  name: string;
  image: string;
  price: number;
  category: string;
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]); // Use Category[] type for state
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]); // Use Product[] type for state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getFeaturedProducts(),
      ]);
      setCategories(categoriesData);
      setFeaturedProducts(productsData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError({
          message:
            err.message === "Request timeout"
              ? "Unable to connect to the server. Please check your API configuration and try again."
              : "Failed to load data. Please try again later.",
          isTimeout: err.message === "Request timeout",
        });
        console.error("Failed to fetch data:", err);
      } else {
        setError({
          message: "An unknown error occurred. Please try again later.",
          isTimeout: false,
        });
        console.error("Failed to fetch data:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage
          title={error.isTimeout ? "Connection Error" : "Error"}
          message={error.message}
          retry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=2070"
          alt="Hero image"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-4 text-5xl font-bold">Summer Collection 2024</h1>
            <p className="mb-6 text-lg">Discover the latest trends in fashion</p>
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.id} className="group cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.count} products</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold">Featured Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <CardDescription>${product.price}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-muted py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Subscribe to Our Newsletter</h2>
          <p className="mb-6 text-muted-foreground">
            Get updates about new products and special offers
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border bg-background px-3 py-2"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
