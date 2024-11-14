import ProductDetails from '@/components/product-details';

// Define the Product type based on your expected API response
type Product = {
  id: string | number;  // Depending on how your API returns the ID
  name: string;
  // Add other fields if needed, for example:
  // description: string;
  // price: number;
  // image: string;
};

// This function tells Next.js which paths to pre-render
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`);
    const products: Product[] = await res.json();  // Explicitly typing the response as Product[]
    
    // Map the products to generate params for static generation
    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetails id={params.id} />;
}
