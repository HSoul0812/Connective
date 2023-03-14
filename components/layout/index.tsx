import Image from 'next/image'
import { User } from '../../types/types'
import Avatar from '../avatar'
import Sidebar from '../sidebar'

type Props = {
  title: string
  scroll?: boolean
  user: User
  children: React.ReactNode
}

const Layout = ({ title, scroll = true, user, children }: Props) => {
  return (
    <main
      className={`flex flex-row ${
        scroll ? 'min-h-screen' : 'h-screen max-h-screen'
      } min-w-screen font-[Montserrat]`}
    >
      <Sidebar user={user}></Sidebar>
      <div
        className={`w-screen h-screen ${
          scroll ? 'overflow-y-scroll' : 'h-full max-h-screen'
        } flex flex-col relative`}
      >
        <div className="flex justify-between">
          <p className="mt-[22px] ml-[40px] mb-[50px] text-[#A0AEC0] text-sm">
            General /{' '}
            <span className="font-bold text-3xl leading-[29px] text-[#0D1011]">
              {title}
            </span>
          </p>
          <div className="flex mt-[22px] ml-[40px] mb-[50px] items-center">
            <div className="relative mr-5">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                placeholder="Search here..."
                className={`placeholder:text-sm outline-none w-full pl-[36px] pr-[14px] text-sm py-2 rounded-lg outline-gray/5 focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300`}
              />
            </div>
            <div className="bg-gray/[0.1] rounded-full items-center flex p-[4px]">
              <Image src="/assets/messages/alarm.svg" height={40} width={40} />
            </div>
            <div className="flex items-center ml-5 mr-3">
              <Image src="/assets/Pratham.svg" height={40} width={40} />
              <div className="ml-3 mr-5">
                <div className="font-bold text-sm">Pratham Doshi.</div>
                <div className="text-sm text-gray">Mananger</div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </main>
  )
}

export default Layout
