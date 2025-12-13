import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import NavItems from "../_components/nav-items";
import MobileNav from "../_components/mobile-nav";

function Header() {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/logo.svg"
            width={128}
            height={38}
            alt="EventHut Logo"
          />
        </Link>
        {/* Desktop menu */}
        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>
        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSwitchSessionUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="size-lg rounded-full">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export default Header;
