import { Button } from "@/components/ui/button";
import Features from "@/components/ui/mianLanding/Features";
import Footer from "@/components/ui/mianLanding/Footer";
import Initials from "@/components/ui/mianLanding/Initials";
import { MotionCards } from "@/components/ui/mianLanding/MotionCards";
import Reviews from "@/components/ui/mianLanding/Reviews";
import NavBar from "@/components/ui/nav/NavBar";


export default function Home() {
  return (
    <section>
      <div className=" min-h-screen">
      <NavBar/>
      <Initials/>
      <MotionCards/>
      <div className=" flex flex-col justify-center items-center my-14 ">
         <p className=" text-muted-foreground">Get Free 20 GB Of Storage</p>
         <div className=" flex justify-center mt-5 gap-5">
         <Button>Get Started</Button>
         <Button variant={"outline"}>Learn More</Button>
         </div>
      </div>
      </div>
    
    <Features/>
    <Reviews/>
    <Footer/>
    </section>
  );
}
