import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { ProductsProvider } from "@/context/products-context";
import Index from "./pages/Index.tsx";
import Konwerter from "./pages/Konwerter.tsx";
import Tracking from "./pages/Tracking.tsx";
import QC from "./pages/QC.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProductsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/konwerter" element={<Konwerter />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/qc" element={<QC />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProductsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
