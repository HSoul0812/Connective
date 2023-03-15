import axios from "axios"
import {useState, useEffect} from "react"
import Sidebar from "../components/sidebar/sidebar"

export default function Home() {
  const [accounts, setAccounts] = useState([])
  const getAccounts = async () => {
    let {data} = await axios.get("/api/get-users")
    console.log(data)
    setAccounts(data)
  }

  useEffect(() => {
    getAccounts()
  }, [])

  return (
    <main  className="bg-slate-900 flex flex-row min-w-screen min-h-screen">
      {/*<Sidebar></Sidebar>*/}
      <div  className="flex flex-col mx-20 w-full">
        <p  className="text-2xl font-bold mb-5 mt-10">Users</p>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-20">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="py-3 px-6">
                          ID
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Email
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Stripe ID
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Username
                      </th>
                  </tr>
              </thead>
              <tbody>
                  {accounts.map((item, index) => {
                      return (
                        <tr className="bg-white dark:bg-gray-800">
                          <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</th>
                          <td className="py-4 px-6">{item.email}</td>
                          <td className="py-4 px-6">{item.stripeID}</td>
                          <td className="py-4 px-6">{item.username}</td>
                        </tr>
                      )
                  })}
              </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
