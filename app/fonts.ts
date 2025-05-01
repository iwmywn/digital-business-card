import { Nunito, Inter, Roboto, Montserrat, Open_Sans } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
});

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
});

const openSans = Open_Sans({
  subsets: ["latin", "vietnamese"],
});

export { nunito, inter, roboto, montserrat, openSans };
