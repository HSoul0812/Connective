import axios from 'axios'
import { useState, useEffect, useRef, ReactNode } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/layout'
import { withIronSession } from 'next-iron-session'
import Select from 'react-select'
import searchIcon from '../../../public/assets/search-2.svg'
import Image from 'next/image'
import { Recache } from 'recache-client'
import Head from 'next/head'
import ReactPaginate from 'react-paginate'
import * as Routes from '../../../util/routes'
import DiscoverList from '../../../components/discover/list'
import {
  Business,
  DiscoverUser,
  Individual,
  Industry,
  User,
} from '../../../types/types'
import { business, individual } from '../../../util/validation/onboarding'
import {
  ProfileApiResponse,
  IApiResponseError,
} from '../../../types/apiResponseTypes'
import { DAO } from '../../../lib/dao'

function Items({ currentItems }: { currentItems: Array<ReactNode> }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item: ReactNode, index: number) => (
          <div key={index}>{item}</div>
        ))}
    </>
  )
}

export default function Messages({ user, industries }) {
  const router = useRouter()
  const discoverRef = useRef(null)

  const [users, setUsers] = useState<DiscoverUser[]>([])
  const [filter, setFilter] = useState<string>('')
  const [filteredUsers, setFilteredUsers] = useState<DiscoverUser[]>([])
  const [page, setPage] = useState<number>(0)
  const [defaultIndustry, setDefaultIndustry] = useState<{
    value: string | number
    label: string
  }>()
  const [selectedIndustry, setSelectedIndustry] = useState<{
    value: string | number
    label: string
  }>()

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState<number>(0)

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  // items per page = 10
  const endOffset = itemOffset + 10
  console.log(`Loading items from ${itemOffset} to ${endOffset}`)
  const currentItems = filteredUsers.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(filteredUsers.length / 10)

  // Invoke when user click to request another page.
  const handlePageClick = (page) => {
    setPage(page.selected)
    const newOffset = (page.selected * 10) % filteredUsers.length
    setItemOffset(newOffset)
  }

  const getUsers = async () => {
    let start = Date.now()
    const res: ProfileApiResponse.IDiscoverProfiles | IApiResponseError = (
      await Recache.cached(137, axios.get, ['/api/profiles'])
    ).data
    if (res.type == 'IApiResponseError') throw res
    else {
      let elapsed = Date.now() - start
      console.log(elapsed)
      //const {data} = await axios.get("/api/profiles")
      setUsers(res.users.filter((a) => a.show_on_discover))
    }
  }

  const getIndustry = async () => {
    let account
    let individual: Individual = (
      await axios.get(`/api/profiles/individual/${user.id}`)
    ).data.individual
    let business: Business = (
      await axios.get(`/api/profiles/business/${user.id}`)
    ).data.business
    if (!individual && business) {
      account = business
    } else if (individual && !business) {
      account = individual
    }
    let temp = industries
      .map((industry) => {
        return { value: industry.id.toString(), label: industry.name }
      })
      .find((a) => a.value == account.industry)
    setDefaultIndustry(temp)
    setSelectedIndustry(temp)
  }

  useEffect(() => {
    try {
      Recache.logEvent_AutodetectIp('discover')
    } catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    if (typeof user == 'undefined') {
      router.push(Routes.SIGNIN)
    } else {
      getIndustry()
    }
  }, [user])

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (a) =>
          a.username.toLowerCase().includes(filter.toLowerCase()) &&
          a?.industry == selectedIndustry.value,
      ),
    )
  }, [filter, selectedIndustry, defaultIndustry])

  useEffect(() => {
    Recache.init('cac121461df5ec95fd867894904f0839b108b03a', 235)

    getUsers()
  }, [])

  return (
    <Layout user={user} title="Discover">
      <Head>
        <title>Discover - Conenctive</title>
      </Head>
      <div className="ml-[64px] mr-20 h-screen">
        <div className="flex flex-row w-[100%] mb-20 gap-10 items-center mt-20">
          <div className="w-full relative">
            <div className="absolute z-[10] p-[10px]">
              <Image
                src={searchIcon}
                alt="Search icon"
                width="16px"
                height="16px"
              />
            </div>
            <input
              onChange={(e) => {
                setFilter(e.target.value)
              }}
              placeholder="Search for lists"
              className="w-full z-[5] h-fit outline-none pl-10 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300 text-[14px]"
            ></input>
          </div>
          {defaultIndustry && (
            <Select
              placeholder="Industry"
              isMulti={false}
              options={industries.map((industry) => {
                return { value: industry.id, label: industry.name }
              })}
              defaultValue={defaultIndustry}
              onChange={(e) => {
                setSelectedIndustry(e)
              }}
              className="w-[250px] text-[12px]"
            ></Select>
          )}

          {/*
          <Select placeholder="Sort"  className="w-[250px] text-[12px]"></Select>
          */}
        </div>
        <div className="flex flex-col w-full gap-10 pb-20" ref={discoverRef}>
          <ReactPaginate
            forcePage={page}
            breakLabel="..."
            nextLabel="next >"
            onPageChange={(page) => handlePageClick(page)}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
          />

          <Items
            currentItems={currentItems.map((item) => {
              return (
                <DiscoverList
                  id={item.id}
                  title={item.username}
                  description={item.description}
                  imgURL={item.logo}
                  status={item?.status ? item.status : null}
                />
              )
            })}
          />

          <ReactPaginate
            forcePage={page}
            breakLabel="..."
            nextLabel="next >"
            onPageChange={function (page) {
              handlePageClick(page)
              discoverRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
          />
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get('user')

    if (!user) {
      return { props: {} }
    }

    const industries = await DAO.Industries.getAll()

    return {
      props: { user, industries },
    }
  },
  {
    cookieName: 'Connective',
    cookieOptions: {
      secure: process.env.NODE_ENV == 'production' ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  },
)
