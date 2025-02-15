import { Typography } from "@mui/material";

interface DescriptionProps {
  text: string;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
  return (
    <>
      {text.split("\n\n").map((paragraph, index) => (
        <Typography
          key={index}
          variant="body2"
          color="text.secondary"
          sx={{ mb: index < text.split("\n\n").length - 1 ? 2 : 0 }}
        >
          {paragraph}
        </Typography>
      ))}
    </>
  );
};

export default Description;
