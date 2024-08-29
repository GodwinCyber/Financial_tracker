/**
 * WelcomeMsg Component:
 * - Utilizes `useUser` hook from Clerk to fetch user data.
 * - Displays a personalized welcome message with the user's first name once data is loaded.
 * - Shows a default message "Welcome Back" while user data is still being fetched.
 * - Includes a brief description below the welcome message.
 * - Adjusts text size based on screen size for responsiveness.
 */

"use client";

import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
    const { user, isLoaded } = useUser();

    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                Welcome Back{isLoaded ? ", " : " "}{user?.firstName}
            </h2>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p className="text-sm lg:text-base text-[#88BDBF]">
                Here is your Financial Summary Report.
            </p>
        </div>
    );
}
