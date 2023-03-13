import { User } from "../../types/types";
import Sidebar from "../sidebar";

type Props = {
  title: string;
  scroll?: boolean;
  user: User;
  children: React.ReactNode;
};

const Layout = ({ title, scroll = true, user, children }: Props) => {
  return (
    <main
      className={`flex flex-row ${
        scroll ? "min-h-screen" : "h-screen max-h-screen"
      } min-w-screen font-[Montserrat]`}
    >
      <Sidebar user={user}></Sidebar>
      <div
        className={`w-screen h-screen ${
          scroll ? "overflow-y-scroll" : "h-full max-h-screen"
        } flex flex-col bg-[#F5F5F5] relative`}
      >
        <p className="font-bold text-3xl leading-[29px] text-[#0D1011] mt-[65px] ml-[64px]">
          {title}
        </p>
        {children}
      </div>
    </main>
  );
};

export default Layout;
