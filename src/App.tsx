import { useState, useEffect, lazy, Suspense } from "react";
import { AnimateUIProvider } from "@animate-ui/react/provider";
import { TooltipProvider } from "./components/ui/tooltip";
import { ComponentsPage, type ProductId } from "./components/pages/ComponentsPage";
import { Navbar, type AppPage } from "./components/navigation/Navbar";
import type { IncomingStudioTarget } from "./components/studio/Studio";
import type { StudioComponentId } from "./components/studio/registry";

const Studio = lazy(() => import("./components/studio/Studio"));
const HowToUsePage = lazy(() =>
  import("./components/pages/HowToUsePage").then((m) => ({ default: m.HowToUsePage }))
);
const PricingPage = lazy(() =>
  import("./components/pages/PricingPage").then((m) => ({ default: m.PricingPage }))
);

const VALID_PRODUCTS: ProductId[] = [
  "bot-avatar",
  "color-picker",
  "palette",
  "wake-slider",
  "gradient",
];

function parseHashState(): { page: AppPage; product: ProductId | null } {
  if (typeof window === "undefined") {
    return { page: "showcase", product: null };
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "studio" || hash === "how-to-use" || hash === "pricing" || hash === "prices") {
    return { page: hash === "prices" ? "pricing" : (hash as AppPage), product: null };
  }
  if (hash.startsWith("showcase/")) {
    const sub = hash.slice("showcase/".length) as ProductId;
    if (VALID_PRODUCTS.includes(sub)) {
      return { page: "showcase", product: sub };
    }
  }
  return { page: "showcase", product: null };
}

export default function App() {
  const [page, setPage] = useState<AppPage>(() => parseHashState().page);
  const [selectedProduct, setSelectedProduct] = useState<ProductId | null>(
    () => parseHashState().product
  );
  const [studioTarget, setStudioTarget] = useState<IncomingStudioTarget | null>(null);

  // Sincronizare cu hash-ul din URL (funcționează și butoanele Înapoi/Înainte din browser)
  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashState();
      setPage((prevPage) => {
        if (prevPage !== next.page) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return next.page;
      });
      setSelectedProduct(next.product);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (target: AppPage) => {
    setPage(target);
    if (target === "showcase") {
      setSelectedProduct(null);
    }
    if (typeof window !== "undefined") {
      window.location.hash = `#${target}`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectProduct = (productId: ProductId | null) => {
    setSelectedProduct(productId);
    if (typeof window !== "undefined") {
      window.location.hash = productId ? `#showcase/${productId}` : "#showcase";
    }
  };

  const handleOpenInStudio = (componentId: StudioComponentId, config?: unknown) => {
    setStudioTarget({ componentId, config });
    navigateTo("studio");
  };

  return (
    <AnimateUIProvider tempo={0.9} checkAnimation="pop">
      <TooltipProvider>
        <div className="min-h-screen w-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
          <Navbar currentPage={page} onNavigate={navigateTo} />
          <div className="flex-1 w-full">
            {page === "showcase" && (
              <ComponentsPage
                selectedProduct={selectedProduct}
                onSelectProduct={handleSelectProduct}
                onNavigateToStudio={() => navigateTo("studio")}
                onOpenInStudio={handleOpenInStudio}
                onNavigateToPricing={() => navigateTo("pricing")}
              />
            )}
            <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] w-full bg-background" />}>
              {page === "studio" && (
                <Studio
                  onNavigateToShowcase={() => navigateTo("showcase")}
                  incomingTarget={studioTarget}
                />
              )}
              {page === "how-to-use" && (
                <HowToUsePage
                  onNavigateToStudio={() => navigateTo("studio")}
                  onNavigateToShowcase={() => navigateTo("showcase")}
                  onNavigateToPricing={() => navigateTo("pricing")}
                />
              )}
              {page === "pricing" && (
                <PricingPage
                  onNavigateToStudio={() => navigateTo("studio")}
                  onNavigateToShowcase={() => navigateTo("showcase")}
                />
              )}
            </Suspense>
          </div>
        </div>
      </TooltipProvider>
    </AnimateUIProvider>
  );
}
