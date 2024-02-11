import { Button } from "@/components/ui/button";
import { BookCheck, Medal } from "lucide-react";
import Link from "next/link";
import { Poppins } from "next/font/google"
import localFont from "next/font/local"
import { cn } from "@/lib/utils";


const headingFont = localFont({
  src: "../../public/fonts/font.woff2"
})
const textFont = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ]
})

export default function MarketingPage() {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className={cn(
        "flex items-center justify-center flex-col",
        headingFont.className
      )}>
        <div className="mb-4 flex items-centerYour Central Hub for Effortless Task Managementr shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
          <BookCheck className="h-6 w-6 mr-2" />
          Effortless Task Management
        </div>

        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6"><b>TaskHub</b> elevates productivity, </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-2 w-fit">simplify your workflow.</div>
        {/* <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit"></div> */}
      </div>

      <div className={cn(
        "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
        textFont.className
      )}>
        Bring your teams together. Collaborate seamlessly in real-time, whether you're working in the office, from home, or on the go. TaskHub keeps your team connected, ensuring everyone is on the same page.
      </div>

      <Button className="mt-6" size={"lg"} asChild>
        <Link href={"/sign-up"}>Get TaskHub for free</Link>
      </Button>
    </div>
  );
}
