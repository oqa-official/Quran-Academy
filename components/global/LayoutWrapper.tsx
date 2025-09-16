"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { OfferPopup } from "./OfferPopup";
import { PopupProvider } from "@/context/PopupContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { UserProvider } from "@/context/UserContext";

interface LayoutWrapperProps {
    children: ReactNode;
}

// ✅ routes where header/footer should NOT appear
const excludedRoutes = ["/onboarding/*" ,"/auth/*", "/admin-dashboard/*", "/inquire/*", "/student-dashboard/*", "/teacher-dashboard/*"];

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
        <UserProvider>
            <CurrencyProvider>
                <PopupProvider>
                    {!isExcluded && <Header />}
                    {children}
                    {!isExcluded && <Footer />}
                </PopupProvider>
            </CurrencyProvider>
        </UserProvider>
    );
}
