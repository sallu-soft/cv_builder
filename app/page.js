import { Button } from "@/components/ui/button";
import Image from "next/image";
import Login from "./components/Login";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Login/>
    </div>
    
  );
}
