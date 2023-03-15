import Link from "next/link"

const Sidebar = () => {
    let options = [
        {text: "Accounts", link: "accounts"}, 
        {text: "Business Users", link: "business-users"},
        {text: "Individual Users", link: "individual-users"},
        {text: "Lists", link: "lists"}
    ]

    return (
        <div  className="flex flex-col text-black">
            {options.map((item, index) => {
                return (
                    <Link href={item.link}>
                        <p>{item.text}</p>
                    </Link>
                )
            })}
        </div>
    )
}

export default Sidebar