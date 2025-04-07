import { Typography } from "@mui/material";

interface HeadingProps {
  level: string;
  text: string;
}

const Heading = (props: HeadingProps) => {
  return <Typography variant={props.level as "h1"}>Lalalalala</Typography>;
};

export default Heading;
