import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="cus-bg-dotted-pattern flex min-h-screen w-full items-center justify-center bg-cover bg-fixed bg-center">
      <SignUp />
    </div>
  );
}
