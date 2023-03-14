import { ChangeEvent } from "react";

type Props = {
  col1: string;
  col2: string;
};

const HeaderRow = ({ col1, col2 }: Props) => {
  return (
    <div className="flex flex-row rounded-tl-lg rounded-tr-lg border-[1px] border-black/30">
      <div className="w-full text-center border-r border-black/30 py-2">
        <p className="font-bold text-[14px]">{col1}</p>
      </div>
      <div className="w-full text-center py-2">
        <p className="font-bold text-[14px]">{col2}</p>
      </div>
    </div>
  );
};

const Row = ({ id, data, setData }) => {
  const updateName = (e: ChangeEvent<HTMLInputElement>) => {
    let d = data;
    d[id].name = e.target.value;
    setData(d);
  };

  const updateDescription = (e: ChangeEvent<HTMLInputElement>) => {
    let d = data;
    d[id].description = e.target.value;
    setData(d);
  };

  return (
    <div
      className={`flex flex-row border border-black/30 h-10 ${
        id == data.length - 1 ? "rounded-b-xl" : ""
      }`}
    >
      <div className={`w-full text-center border-r border-black/30`}>
        <input
          defaultValue={data[id].name}
          onChange={updateName}
          className="w-full h-full outline-none px-5 rounded-xl"
        ></input>
      </div>
      <div className={`w-full text-center`}>
        <input
          defaultValue={data[id].description}
          onChange={updateDescription}
          className="w-full h-full outline-none px-5 rounded-xl"
        ></input>
      </div>
    </div>
  );
};

const ConfigurableTable = ({
  data,
  setData,
  column1Name,
  column2Name,
  title,
}) => {
  // console.log(data);
  return (
    <div>
      <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-3 1bp:text-[16.5px]">
        {title}
      </p>

      <div className="rounded-xl mb-[12px]">
        <HeaderRow col1={column1Name} col2={column2Name} />
        {data.map((item, index) => {
          return <Row key={index} id={index} data={data} setData={setData} />;
        })}
      </div>

      <div className="flex flex-row gap-5">
        <div
          className="bg-[#061A40] text-white rounded-lg w-[69px] h-[28px] flex flex-row items-center justify-center"
          onClick={() => {
            setData([...data, { name: "", description: "" }]);
          }}
        >
          <div className="flex flex-row items-center justify-center gap-[10px] cursor-pointer">
            <p className="">+</p>
            <p className="text-white text-[12px] font-[Poppins] font-semibold">
              Add
            </p>
          </div>
        </div>
        <div
          className="bg-white text-[#061A40] rounded-lg w-[94px] h-[28px] flex flex-row items-center justify-center border-[1px] border-[#061A40]"
          onClick={() => {
            let d = data;
            d.shift();
            console.log(d);
            setData([...d]);
          }}
        >
          <div className="flex flex-row items-center justify-center gap-[10px] cursor-pointer">
            <p className="">-</p>
            <p className="text-[#061A40] text-[12px] font-[Poppins] font-semibold">
              Remove
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurableTable;
