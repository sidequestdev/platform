import React from "react";
import { footerData } from "~/mocks/footer";
import { navbarLinks } from "~/mocks/navbar";
import { Courses } from "./Courses";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { HeaderResponsive } from "./Header";
import { Hero } from "./Hero";

export default function App() {
  return (
    <>
      <HeaderResponsive
        links={navbarLinks.filter((link) => link.hidden !== true)}
      />
      <Hero />
      <Features
        title="Integrate effortlessly with any technology stack"
        description="Every once in a while, you'll see a Golbat that's missing some fangs. This happens when hunger drives it to try biting a Steel-type Pokémon."
      />
      <Courses title="Courses" description="Choose your path" />
      <Footer data={footerData} />
    </>
  );
}
