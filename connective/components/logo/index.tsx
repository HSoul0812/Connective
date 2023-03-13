type Props = {
  white?: boolean;
};

const Logo = ({ white = false }: Props) => {
  if (white)
    return (
      <div className="flex flex-row pl-10 py-2 border-black/10 border-b">
        <img
          className="my-auto -mr-7"
          src="../assets/logo-icon-white.png"
        ></img>
        <img className="mt-1" src="../assets/logo-text-white.png"></img>
      </div>
    );
  if (!white)
    return (
      <div className="flex flex-row pl-10 py-2 border-black/10 border-b">
        <img className="my-auto -mr-7" src="../assets/logo-icon.png"></img>
        <img className="mt-1" src="../assets/logo-text.png"></img>
      </div>
    );
};

export default Logo;
