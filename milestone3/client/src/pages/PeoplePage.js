import React from "react";
import "../App.css";
import axios from "axios";

import MovieResultsGrid from "../components/MovieResultsGrid";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import {CircularProgress, Container, FormControl, Grid, InputLabel, OutlinedInput} from "@mui/material";
import MovieSearchForm from "../components/MovieSearchForm";
import CustomAppBar from "../components/CustomAppBar";
import PeopleResultsGrid from "../components/PeopleResultsGrid";

const drawerWidth = 0;

function PeoplePage() {
    const [data, setData] = React.useState(null);

    const [query, setQuery] = React.useState({query: '*'})

    const handleSubmit = event => {
        event.preventDefault();

        axios.get("/api/people", {params: {query: query}})
            .then(res => setData(res.data))
    }

    const handleChange = event => {
        setQuery(event.target.value);
    }


    const onPageChange = page => {
        axios.get("/api/people", {params: {query: query, page: page}})
            .then(res => setData(res.data))
    }

    React.useEffect(() => {
        axios.get("/api/people?query=*")
            .then(res => setData(res.data));
    }, [])

    return (
        <div className="App">
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <CustomAppBar drawerWidth={drawerWidth}/>

                <Box
                    component="main"
                    sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}
                >
                    <Toolbar/>
                    <Grid container direction="column">
                        <Grid alignSelf="center" item width={'50%'}>
                            <form onSubmit={handleSubmit}>
                                <FormControl fullWidth>
                                    <InputLabel name="query" htmlFor="search-query">Search for a person</InputLabel>
                                    <OutlinedInput onChange={handleChange} id="search-query" label="Search for a person"/>
                                </FormControl>
                            </form>
                        </Grid>
                        <Grid alignSelf="center" item width={'50%'}>
                            <Grid container direction="column" alignItems="center">
                                {!data ? <CircularProgress color="inherit"/> :
                                    <PeopleResultsGrid
                                        pages={data.pages}
                                        people={data.people}
                                        time={data.time}
                                        total={data.total}
                                        handlePageChange={onPageChange}
                                    />
                                }
                            </Grid>
                        </Grid>
                    </Grid>



                </Box>
            </Box>
        </div>
    );
}

export default PeoplePage;