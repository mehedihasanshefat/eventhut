import React from "react";
import Footer from "./_sections/footer";
import Header from "./_sections/header";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}

export default RootLayout;
