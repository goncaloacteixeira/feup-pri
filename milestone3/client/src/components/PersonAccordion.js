import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CircularProgress, Grid } from "@mui/material";
import axios from "axios";
import MovieCard from "./MovieCard";

export default function PersonAccordion({ imdb_name_id, tmdb_id, biography }) {
  const [movieIds, setMovieIds] = React.useState([]);
  const [movies, setMovies] = React.useState([]);
  React.useEffect(() => {
    axios
      .get(`/tmdb/person/${tmdb_id}/movies`)
      .then((res) => setMovieIds(res.data.message));
  }, []);

  React.useEffect(async () => {
    let to_update = [];
    for (let id of movieIds) {
      const res = await axios.get(`/solr/movies/${id}`);
      if (res.data.movie) to_update.push(res.data.movie);
    }
    setMovies(to_update);
  }, [movieIds]);

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Biography</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">{biography}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h5">Related Movies</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid spacing={2} container direction="column">
            {movies.length === 0 ? (
              <CircularProgress align="center" />
            ) : (
              movies.map((value) => {
                return (
                  <Grid key={`${imdb_name_id}_${value.imdb_title_id}`} item>
                    <MovieCard movie={value} />
                  </Grid>
                );
              })
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
