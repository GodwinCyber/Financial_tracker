"use client";

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {

    // fix the hydration error using useMountedState
    const isMounted = useMountedState();
    if (!isMounted) return null;
    return (
        <>
            <NewAccountSheet />
        </>
    );
};
