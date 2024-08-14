import { useContext } from "react";
import { LevelContext } from "../../context/LevelContext";

type HeadingProps = {
  children: React.ReactNode;
};

export default function Heading({ children }: HeadingProps) {
  const level = useContext(LevelContext);

  switch (level) {
    case 1:
      return <h1 className="bg-blue-100">{children}</h1>;
    case 2:
      return <h2 className="bg-blue-200">{children}</h2>;
    case 3:
      return <h3 className="bg-blue-300">{children}</h3>;
    case 4:
      return <h4 className="bg-blue-400">{children}</h4>;
    case 5:
      return <h5 className="bg-blue-500">{children}</h5>;
    case 6:
      return <h6 className="bg-blue-600">{children}</h6>;
    default:
      throw Error("Unknown level: " + level);
  }
}
