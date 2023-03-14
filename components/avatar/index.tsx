import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";
import Image from "next/image";

type Props = {
  title: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const Avatar = ({
  title,
  width = null,
  height = null,
  className = null,
}: Props) => {
  let avatar = createAvatar(style, {
    seed: title,
    dataUri: true,
    fontSize: width ? 40 : 25,
  });

  return (
    <div>
      <Image
        objectFit="cover"
        className={className || "rounded"}
        // @ts-ignore
        layout={width ? "" : "fill"}
        width={width}
        height={height}
        src={avatar}
      />
    </div>
  );
};

export default Avatar;
