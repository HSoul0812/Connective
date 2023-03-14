import ButtonDark from "../../button-dark";
import ButtonLight from "../../button-light";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { ListItem } from "../../../types/types";

type Props = {
  item: ListItem;
};

const ListRow = ({ item }: Props) => {
  const [published, setPublished] = useState<boolean>(item.published);
  console.log(item);

  const togglePublish = async () => {
    if (published) {
      axios.post(`/api/lists/unpublish/${item.id}`);
      setPublished(false);
    } else {
      axios.post(`/api/lists/publish/${item.id}`);
      setPublished(true);
    }
  };

  return (
    <div className="w-[292px] min-h-[385px] bg-white rounded-xl shadow-lg flex flex-col justify-between p-[12px] border-[0.5px] border-[#E0E0E0]">
      <div>
        <div className="rounded-xl max-w-[268px] min-h-[153px] object-cover relative overflow-hidden mb-[12px]">
          <Image
            className=""
            objectFit="cover"
            src={
              !item.cover_url || item.cover_url == "null"
                ? "/assets/banners/leaves-min.jpeg"
                : item.cover_url
            }
            width="268px"
            height="153px"
          />
        </div>

        <div className="flex flex-col">
          <p className="font-bold text-[18px] leading-[20px] text-[#0D1011] mb-[12px]">
            {item.title}
          </p>
          <p className="font-normal text-[12px] leading-[18px] text–[rgba(13_16_17_0.7)] mb-[15px] text-[#0d1011b3]">
            {item.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="font-bold text-[26px] leading-[29px] text-[#0D1011] text-center mb-[12px]">
          <p>${Number(item.price).toFixed(2)}</p>
        </div>
        <Link href={`lists/edit/${item.id}/1`}>
          <ButtonDark
            text="Edit"
            className="w-full text-[12px] mb-[4px] bg-[#061A40]"
          ></ButtonDark>
        </Link>
        <ButtonLight
          text={published ? "Unpublish" : "Publish"}
          className="w-full text-[12px] border-[#727474] text-[#727474]"
          onClick={togglePublish}
        ></ButtonLight>
      </div>
    </div>
  );
};

export default ListRow;
