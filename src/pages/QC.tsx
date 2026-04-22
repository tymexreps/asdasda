import { useState } from "react";
import { Database, Search, Package, Star, ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Crown, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProducts, Product } from "@/context/products-context";

const categories = ["Wszystkie", "Buty", "Bluzy", "Koszulki", "Spodnie", "Akcesoria", "Inne"];

function ratingColor(r: number) {
  if (r >= 9) return "text-green-400 bg-green-400/10 border-green-400/30";
  if (r >= 7) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  if (r >= 5) return "text-orange-400 bg-orange-400/10 border-orange-400/30";
  return "text-red-400 bg-red-400/10 border-red-400/30";
}

function QCGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
        <ImageIcon className="h-10 w-10 opacity-30" />
        <p className="text-sm">Brak zdjęć QC</p>
      </div>
    );
  }
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);
  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted">
        <img src={images[active]} alt={`QC ${active + 1}`} className="w-full h-full object-contain" />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Poprzednie"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Następne"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-xs text-white">
              {active + 1}/{images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-0 gap-0">
        {product && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base font-semibold leading-tight">{product.name}</DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-foreground">{product.price}</span>
                    <span className="text-xs text-muted-foreground">{product.category}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${ratingColor(product.rating)}`}
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {product.rating}/10
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border
                        ${product.batch === "best"
                          ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-300"
                          : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"}`}
                    >
                      {product.batch === "best" ? <Crown className="h-3 w-3" /> : <Wallet className="h-3 w-3" />}
                      {product.batch === "best" ? "Best Batch" : "Budget Batch"}
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-5">
              {product.description && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Opis</p>
                  <p className="text-sm text-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Zdjęcia QC ({product.qcImages.length})
                </p>
                <QCGallery images={product.qcImages} />
              </div>

              <div className="space-y-2">
                {product.kakobuyLink && (
                  <a
                    href={product.kakobuyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
                  >
                    Kup na Kakobuy
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {product.usfansLink && (
                  <a
                    href={product.usfansLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
                  >
                    Kup na USFans
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {!product.kakobuyLink && !product.usfansLink && (
                  <p className="text-center text-sm text-muted-foreground py-2">Brak linków zakupu</p>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const QC = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const filteredItems = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Wszystkie" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="h-8 w-8 text-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Produkty</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Przeglądaj produkty dodane przez społeczność. Kliknij "Informacje" aby zobaczyć zdjęcia QC.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj produktu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px] bg-background">
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Znaleziono <span className="text-foreground font-medium">{filteredItems.length}</span> produktów
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-muted-foreground/40 transition-colors group"
            >
              <div className="aspect-square bg-accent relative overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Package className="h-12 w-12 opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
                  {item.category}
                </div>
                <div
                  className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider
                    ${item.batch === "best"
                      ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-300"
                      : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"}`}
                >
                  {item.batch === "best" ? <Crown className="h-3 w-3" /> : <Wallet className="h-3 w-3" />}
                  {item.batch === "best" ? "Best" : "Budget"}
                </div>
                {item.qcImages.length > 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
                    {item.qcImages.length} QC
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{item.name}</h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
                )}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-foreground">{item.price}</p>
                  <Button size="sm" variant="outline" onClick={() => setActiveProduct(item)} className="text-xs h-8 px-3">
                    Informacje
                  </Button>
                </div>
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${ratingColor(item.rating)}`}
                >
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {item.rating}/10
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Brak wyników</h3>
            <p className="text-muted-foreground">Spróbuj zmienić filtry lub wyszukać coś innego</p>
          </div>
        )}
      </div>

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </div>
  );
};

export default QC;
