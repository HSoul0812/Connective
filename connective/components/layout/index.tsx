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
        <div className="flex justify-between bg-[#F8F9FA]">
          <p className="mt-[22px] ml-[40px] mb-[50px] text-[#A0AEC0] text-sm">
            General /{' '}
            <span className="font-bold text-3xl leading-[29px] text-[#0D1011]">
              {title}
            </span>
          </p>
        </div>
        {children}
      </div>
    </main>
  )
}

export default Layout
