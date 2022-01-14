import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import axios from "axios";

export default function PersonCard(props) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("/tmdb/person/" + props.person.imdb_name_id)
      .then((res) => setData(res.data.message));
  }, []);

  return (
    <Card>
      <Grid container>
        <Grid item xs={2} align="center">
          {!data ? (
            "loading..."
          ) : (
            <img
              height="auto"
              width="100%"
              src={"https://image.tmdb.org/t/p/w185" + data.profile_path}
              alt={props.person.name + " picture"}
            />
          )}
        </Grid>
        <Grid item xs={10}>
          <CardContent>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="h6">
                  {!data ? "loading..." : data.name}
                </Typography>
                <Typography variant="h7" color="text.secondary">
                  {props.person.birth_name}
                </Typography>
              </Grid>
              <Grid item align="right">
                <Typography variant="h6">{props.person.role}</Typography>
              </Grid>
            </Grid>
            <Typography textAlign="justify" variant="body1">
              {!data
                ? props.person.bio
                : data.biography
                ? data.biography
                : props.person.bio}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
