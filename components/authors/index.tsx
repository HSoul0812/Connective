const Authors = () => {
  return (
    <table className="w-[100%]">
      <tr>
        <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px]">
          Author
        </th>
        <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px]">
          Function
        </th>
        <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px]">
          Status
        </th>
        <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px]">
          Employed
        </th>
      </tr>
      <tr>
        <td className="text-[#0D1011] font-bold">
          <div className="flex flex-row gap-2">
            <img
              className="rounded-full w-10 h-10 object-cover"
              src="https://avatars.dicebear.com/api/micah/micah.svg"
            />
            <div className="flex flex-col">
              <p className="font-[Montserrat] font-bold text-[16px] text-[#0D1011]">
                John Micheal
              </p>
              <p className="font-[Poppins] font-normal text-[14px]">
                john@creative-tim.com
              </p>
            </div>
          </div>
        </td>
        <td className="text-[#0D1011] font-bold">
          <div className="flex flex-col">
            <p className="font-[Montserrat] font-bold text-[16px] text-[#0D1011]">
              Manager
            </p>
            <p className="font-[Poppins] font-normal text-[14px]">
              Organization
            </p>
          </div>
        </td>
        <td>
          <div className="w-fit h-fit bg-[#2ae76a33] px-[10.5px] py-[2px] rounded-[50px]">
            <p className="text-[#06A83D] font-bold font-[Montserrat] text-[12px] text-center">
              Online
            </p>
          </div>
        </td>
        <td className="text-[#0D1011] font-normal font-[Poppins] text-[14px]">
          12/03/2022
        </td>
      </tr>
    </table>
  );
};

export default Authors;
