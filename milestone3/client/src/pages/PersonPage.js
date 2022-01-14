import { CircularProgress, Grid, Toolbar, Typography } from "@mui/material";
import CakeIcon from "@mui/icons-material/Cake";
import ChurchIcon from "@mui/icons-material/Church";
import CustomAppBar from "../components/CustomAppBar";
import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import PersonAccordion from "../components/PersonAccordion";

export default function PersonPage() {
  const { id } = useParams();
  const [solr, setSolr] = React.useState(null);
  const [tmdb, setTmdb] = React.useState(null);

  React.useState(() => {
    axios.get(`/solr/people/${id}`).then((res) => {
      console.log(res.data.person);
      setSolr(res.data.person);
    });
    axios.get(`/tmdb/person/${id}`).then((res) => {
      console.log(res.data.message);
      setTmdb(res.data.message);
    });
  }, []);

  if (!solr || !tmdb) {
    return <CircularProgress />;
  }

  return (
    <div>
      <CustomAppBar drawerWidth={0} />
      <Toolbar />

      <Grid p={3} container>
        <Grid item md={2}>
          <img
            height="auto"
            src={"https://image.tmdb.org/t/p/w185" + tmdb.profile_path}
            alt={solr.name + " picture"}
          />
        </Grid>
        <Grid item xs={12} md>
          <Grid container direction="column">
            {/* Header */}
            <Grid item>
              <Grid container alignItems="baseline">
                <Typography variant="h2">{solr.name}</Typography>
                <Typography mx={2} variant="h4" color="text.secondary">
                  {solr.birth_name}
                </Typography>
              </Grid>
              <Grid container alignItems="baseline">
                {tmdb.also_known_as.map((value, index) => [
                  index > 0 && (
                    <Typography
                      key={`known-as-${index}-sep`}
                      color="text.secondary"
                      variant="body2"
                    >
                      •
                    </Typography>
                  ),
                  <Typography
                    mx={1}
                    key={`known-as-${index}`}
                    color="text.secondary"
                    variant="body2"
                  >
                    {value}
                  </Typography>,
                ])}
              </Grid>
              <Grid container my={2}>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <CakeIcon />
                    <Typography variant="body1">{tmdb.birthday}</Typography>
                    <Typography mx={2} variant="body1">
                      {tmdb.place_of_birth}
                    </Typography>
                  </Grid>
                </Grid>
                {tmdb.deathday ? (
                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      <ChurchIcon />
                      <Typography variant="body1">{tmdb.deathday}</Typography>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid px={3} container spacing={3} direction="column">
        <Grid item>
          <PersonAccordion
            tmdb_id={tmdb.id}
            imdb_name_id={id}
            biography={
              tmdb.biography.length > solr.bio.length
                ? tmdb.biography
                : solr.bio
            }
          />
        </Grid>
      </Grid>
    </div>
  );
}
