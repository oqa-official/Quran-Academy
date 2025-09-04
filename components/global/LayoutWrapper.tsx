"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { OfferPopup } from "./OfferPopup";

interface LayoutWrapperProps {
    children: ReactNode;
}

// ✅ routes where header/footer should NOT appear
const excludedRoutes = ["/onboarding/*", "/auth/*", "/admin-dashboard/*", "/inquire"];

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname();

    // function to check if current path matches excluded route
    const isExcluded = excludedRoutes.some((route) => {
        if (route.endsWith("/*")) {
            const base = route.replace("/*", "");
            return pathname.startsWith(base);
        }
        return pathname === route;
    });

    return (
        <>
            {!isExcluded && <Header />}
            {/* {!isExcluded && <OfferPopup />} */}
            {children}
            {!isExcluded && <Footer />}
        </>
    );
}
