import { MouseEventHandler } from "react";
import ButtonDark from "../../button-dark";
import ButtonLight from "../../button-light";
import ButtonGreen from "../../button-green";
import { useRouter } from "next/router";
import Image from "next/image";
import { ListItem } from "../../../types/types";

type Props = {
  item: ListItem;
  showModal: MouseEventHandler<HTMLButtonElement>;
};

const ListRow = ({ item, showModal }: Props) => {
  const router = useRouter();

  return (
    <div className="mx-20 ml-[64px]">
      <div className="bg-white rounded-xl shadow-lg flex flex-row gap-5 p-5">
        <div className="rounded-xl h-48 w-[200px] relative overflow-hidden">
          <Image
            objectFit="cover"
            src={
              !item.cover_url || item.cover_url == "null"
                ? "/assets/banners/leaves-min.jpeg"
                : item.cover_url
            }
            width="200px"
            height="200px"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold">{item.title}</p>
          <p className="text-black/50">{item.description}</p>
          <div className="font-[Montserrat] font-bold text-[24px] text-[#0D1011] mt-auto">
            <p>${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex flex-col ml-auto my-auto gap-5">
          <ButtonGreen
            text="Download CSV"
            className="mt-0 mb-0 w-full"
            onClick={() => {
              router.push(item.url);
            }}
          />
          <ButtonDark
            text="Leave Review"
            className="w-full mt-0 mb-0 bg-[#061A40]"
            onClick={showModal}
          />
          <ButtonLight text="Explore More" className="w-full mt-0 mb-0" />
        </div>
      </div>
    </div>
  );
};

export default ListRow;
