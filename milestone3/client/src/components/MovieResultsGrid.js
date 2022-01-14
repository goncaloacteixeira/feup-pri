import { Grid, Pagination, Typography } from "@mui/material";
import MovieCard from "./MovieCard";
import React from "react";

export default function MovieResultsGrid(props) {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
    props.handlePageChange(value);
  };

  return (
    <Grid
      sx={{ maxWidth: 800 }}
      container
      spacing={2}
      direction="column"
      alignItems="stretch"
      justifyContent="center"
    >
      <Grid item align="center">
        <Typography align="left">
          Found {props.total} results in {props.time} seconds
        </Typography>
      </Grid>

      {props.movies.map((x) => {
        return (
          <Grid key={x.imdb_title_id} item align="center" xs={12}>
            <MovieCard movie={x} />
          </Grid>
        );
      })}

      <Grid item align="center">
        <Pagination
          count={props.pages}
          page={page}
          onChange={handleChange}
          onClick={window.scroll({ top: 0, behavior: "smooth" })}
        />
      </Grid>
    </Grid>
  );
}
