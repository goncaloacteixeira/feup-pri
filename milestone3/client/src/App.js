import React from "react";
import "./App.css";
import axios from "axios";

import ResultsGrid from "./components/ResultsGrid";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {CircularProgress, Grid} from "@mui/material";
import SearchForm from "./components/SearchForm";

const drawerWidth = 400;

function App() {
  const [data, setData] = React.useState(null);

  const [query, setQuery] = React.useState({query: '*'})

  const handleSubmit = data => event => {
    event.preventDefault();

    setQuery(data);

    axios.get("/api/movies", {params: data})
      .then(res => setData(res.data))
  }

  const onPageChange = page => {
    axios.get("/api/movies", {params: {...query, page: page}})
      .then(res => setData(res.data))
  }

  React.useEffect(() => {
    fetch("/api/movies?query=*")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [])

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              POPCORN TIME
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />

          <SearchForm handleSubmit={handleSubmit} />

          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <Grid container direction="column" alignItems="center">
            {!data ? <CircularProgress color="inherit" /> :
              <ResultsGrid
                pages={data.pages}
                movies={data.movies}
                time={data.time}
                total={data.total}
                handlePageChange={onPageChange}
              />
            }
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default App;