import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full lg:flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 pt-6">
                    <h1 className="font-bold text-3xl text-[#53565B]">
                        Welcome Back
                    </h1>
                    <p className="text-base text-[#5988C5]">
                        Sign in or create an account to access your dashboard!
                    </p>
                </div>
                <div className="flex items-center justify-center mt-8">
                    <ClerkLoaded>
                        <SignUp />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="animate-spin text-muted-foreground"/>
                    </ClerkLoading>
                </div>
            </div>
            <div className="h-full bg-[#0C0967] hidden lg:flex items-center justify-center">
                <Image src="/image.jpg" height={100} width={100} alt="image"/>
            </div>
        </div>
);
}
