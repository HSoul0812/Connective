import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { creatorMaker } from "../components/creator-maker";
import { Recache } from "recache-client";

if (typeof window !== "undefined") {
  creatorMaker();
  Recache.init("cac121461df5ec95fd867894904f0839b108b03a", 235);
}
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
export default MyApp;
