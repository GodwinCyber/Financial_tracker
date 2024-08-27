import Header from "@/components/header";
import React from "react";

/**
 * Props for DashboardLayout component:
 * - children: React nodes to be rendered within the layout.
 */

type Props = {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <>
            <Header/>
            <main className="px-3 lg:px-14">
                {children}
            </main>
        </>
    );
}

export default DashboardLayout;
