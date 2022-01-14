import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import GenreChip from "./GenreChip";
import PersonCard from "./PersonCard";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  maxHeight: "80%",
  overflowY: "scroll",
  p: 4,
};

export default function MovieModal(props) {
  const [data, setData] = React.useState(null);
  const [fullPlot, setFullPlot] = React.useState(false);

  React.useEffect(() => {
    axios
      .get("/tmdb/poster/" + props.movie.imdb_title_id)
      .then((res) => setData(res.data.message));
  }, []);

  const handleReadMore = () => setFullPlot(!fullPlot);

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <Grid
                alignItems="center"
                container
                py={1}
                justifyContent="space-between"
              >
                <Grid align="left" item>
                  <Grid item>
                    <Typography variant="h3">
                      {props.movie.original_title}
                    </Typography>
                    <Typography variant="h6">{props.movie.title}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" color="text.secondary">
                      {props.movie.duration}m {props.movie.year}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      {props.movie.genre.map((x) => {
                        return (
                          <Grid item key={props.movie.imdb_title_id + "_" + x}>
                            <GenreChip genre={x} />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  <Grid item sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      {props.movie.language
                        ? props.movie.language.map((x) => {
                            return (
                              <Grid
                                item
                                key={props.movie.imdb_title_id + "_" + x}
                              >
                                <GenreChip genre={x} />
                              </Grid>
                            );
                          })
                        : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid item textAlign="end">
                    <Grid display="flex" alignItems="center" item>
                      <Grid
                        container
                        direction="row"
                        align="center"
                        alignItems="center"
                      >
                        <Grid item>
                          <StarIcon />
                        </Grid>
                        <Grid item>
                          <Typography variant="h6">
                            {props.movie.weighted_average_vote}/10.0
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>{props.movie.total_votes} votes</Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Typography variant="h4" sx={{ mt: 2 }}>
                Details
              </Typography>

              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {data
                  ? data.movie
                    ? data.movie.overview
                    : props.movie.description
                  : props.movie.description}
              </Typography>

              {props.movie.plot ? (
                props.movie.plot.length > 350 ? (
                  <div>
                    <Typography
                      textAlign="justify"
                      variant="body2"
                      sx={{ mt: 2 }}
                    >
                      {!fullPlot
                        ? props.movie.plot.substring(0, 350) + "..."
                        : props.movie.plot}
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          textDecoration: "underline",
                          color: "blue",
                          cursor: "pointer",
                        }}
                        onClick={handleReadMore}
                      >
                        Read {fullPlot ? "Less" : "More"}
                      </button>
                    </Typography>
                  </div>
                ) : (
                  <Typography
                    textAlign="justify"
                    variant="body2"
                    sx={{ mt: 2 }}
                  >
                    {props.movie.plot}
                  </Typography>
                )
              ) : null}

              <Typography variant="h4" sx={{ my: 2 }}>
                People
              </Typography>
              <Grid container direction="column" spacing={3}>
                {props.movie.personal
                  ? props.movie.personal.map((x) => {
                      return (
                        <Grid key={x.id} item>
                          <PersonCard person={x} />
                        </Grid>
                      );
                    })
                  : null}
              </Grid>
            </Grid>
            <Grid xs={3} item align="center">
              {!data ? (
                "Loading..."
              ) : (
                <img
                  alt={props.movie.original_title + " poster"}
                  className="poster"
                  src={data.poster}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
