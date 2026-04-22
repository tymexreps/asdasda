import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type Batch = "best" | "budget";

export interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  kakobuyLink: string;
  usfansLink: string;
  category: "Buty" | "Bluzy" | "Koszulki" | "Spodnie" | "Akcesoria" | "Inne";
  createdAt: number;
  rating: number;
  description: string;
  qcImages: string[];
  batch: Batch;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

interface DbRow {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  kakobuyLink: string;
  usfansLink: string;
  category: string;
  rating: number;
  description: string;
  qcImages: unknown;
  batch: string;
  createdAt: string;
}

function rowToProduct(row: DbRow): Product {
  const qc = Array.isArray(row.qcImages) ? (row.qcImages as string[]) : [];
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    imageUrl: row.imageUrl,
    kakobuyLink: row.kakobuyLink,
    usfansLink: row.usfansLink,
    category: (row.category as Product["category"]) ?? "Inne",
    rating: row.rating ?? 0,
    description: row.description ?? "",
    qcImages: qc,
    batch: (row.batch as Batch) ?? "best",
    createdAt: new Date(row.createdAt).getTime(),
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = (await res.json()) as DbRow[];
        setProducts(data.map(rowToProduct));
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 10000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        kakobuyLink: product.kakobuyLink,
        usfansLink: product.usfansLink,
        category: product.category,
        rating: product.rating,
        description: product.description,
        qcImages: product.qcImages,
        batch: product.batch,
      }),
    });
    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        detail = typeof body?.error === "string" ? body.error : JSON.stringify(body?.error ?? body);
      } catch {
        // ignore
      }
      throw new Error(`Nie udało się dodać: ${detail}`);
    }
    await fetchProducts();
  };

  const removeProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to remove product");
    await fetchProducts();
  };

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within a ProductsProvider");
  return context;
}
