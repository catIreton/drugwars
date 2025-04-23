import Typography from "@mui/material/Typography";

interface HeadingProps {
  level: string;
  text: string;
}

const Heading = (props: HeadingProps) => {
  return <Typography variant={props.level as "h2"}>{props.text} </Typography>;
};

export default Heading;
