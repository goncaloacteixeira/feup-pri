import {Chip} from "@mui/material";

export default function GenreChip(props) {
  return (
    <Chip
      label={props.genre}
      component="a"
      href="#"
      variant="outlined"
      clickable
      size="small"
    />
  );
}