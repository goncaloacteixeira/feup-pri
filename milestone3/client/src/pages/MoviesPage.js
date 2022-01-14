import React from "react";
import "../App.css";
import axios from "axios";

import MovieResultsGrid from "../components/MovieResultsGrid";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { CircularProgress, Grid } from "@mui/material";
import MovieSearchForm from "../components/MovieSearchForm";
import CustomAppBar from "../components/CustomAppBar";

const drawerWidth = 400;

function MoviesPage() {
  const [data, setData] = React.useState(null);

  const [query, setQuery] = React.useState({ query: "*" });

  const handleSubmit = (data) => (event) => {
    event.preventDefault();

    setQuery(data);

    axios
      .get("/solr/movies", { params: data })
      .then((res) => setData(res.data));
  };

  const onPageChange = (page) => {
    axios
      .get("/solr/movies", { params: { ...query, page: page } })
      .then((res) => setData(res.data));
  };

  React.useEffect(() => {
    axios.get("/solr/movies?query=*").then((res) => setData(res.data));
  }, []);

  return (
    <div className="App">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <CustomAppBar drawerWidth={drawerWidth} />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />

          <MovieSearchForm handleSubmit={handleSubmit} />

          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <Grid container direction="column" alignItems="center">
            {!data ? (
              <CircularProgress color="inherit" />
            ) : (
              <MovieResultsGrid
                pages={data.pages}
                movies={data.movies}
                time={data.time}
                total={data.total}
                handlePageChange={onPageChange}
              />
            )}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default MoviesPage;
