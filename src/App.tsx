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

function parseRouteState(): { page: AppPage; product: ProductId | null } {
  if (typeof window === "undefined") {
    return { page: "showcase", product: null };
  }

  // Backwards compatibility for legacy #hash URLs
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) {
    if (hash === "studio" || hash === "how-to-use" || hash === "pricing" || hash === "prices") {
      return { page: hash === "prices" ? "pricing" : (hash as AppPage), product: null };
    }
    if (hash.startsWith("showcase/")) {
      const sub = hash.slice("showcase/".length) as ProductId;
      if (VALID_PRODUCTS.includes(sub)) {
        return { page: "showcase", product: sub };
      }
    }
  }

  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/studio") {
    return { page: "studio", product: null };
  }
  if (pathname === "/how-to-use") {
    return { page: "how-to-use", product: null };
  }
  if (pathname === "/pricing" || pathname === "/prices") {
    return { page: "pricing", product: null };
  }
  if (pathname.startsWith("/showcase/")) {
    const sub = pathname.slice("/showcase/".length) as ProductId;
    if (VALID_PRODUCTS.includes(sub)) {
      return { page: "showcase", product: sub };
    }
  }

  return { page: "showcase", product: null };
}

function buildRoutePath(page: AppPage, product: ProductId | null = null): string {
  if (page === "showcase") {
    return product ? `/showcase/${product}` : "/";
  }
  return `/${page}`;
}

export default function App() {
  const [page, setPage] = useState<AppPage>(() => parseRouteState().page);
  const [selectedProduct, setSelectedProduct] = useState<ProductId | null>(
    () => parseRouteState().product
  );
  const [studioTarget, setStudioTarget] = useState<IncomingStudioTarget | null>(null);

  // Sync with browser History API (Back / Forward) and legacy hash links
  useEffect(() => {
    const handleRouteChange = () => {
      const next = parseRouteState();
      setPage((prevPage) => {
        if (prevPage !== next.page) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return next.page;
      });
      setSelectedProduct(next.product);
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  const navigateTo = (target: AppPage) => {
    setPage(target);
    if (target === "showcase") {
      setSelectedProduct(null);
    }
    if (typeof window !== "undefined") {
      const nextPath = buildRoutePath(target, null);
      if (window.location.pathname !== nextPath || window.location.hash) {
        window.history.pushState(null, "", nextPath);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectProduct = (productId: ProductId | null) => {
    setSelectedProduct(productId);
    if (typeof window !== "undefined") {
      const nextPath = buildRoutePath("showcase", productId);
      if (window.location.pathname !== nextPath || window.location.hash) {
        window.history.pushState(null, "", nextPath);
      }
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
