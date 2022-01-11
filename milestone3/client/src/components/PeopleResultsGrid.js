import {Grid, Pagination, Typography} from "@mui/material";
import React from "react";
import PersonCard from "./PersonCard";

export default function PeopleResultsGrid(props) {
    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
        props.handlePageChange(value);
    };

    return (
        <Grid
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

            {props.people.map(x => {
                    return (
                        <Grid key={x.imdb_name_id} item align="center" xs={12}>
                            <PersonCard person={x} />
                        </Grid>
                    )
                }
            )}

            <Grid item align="center">
                <Pagination count={props.pages} page={page} onChange={handleChange} onClick={ window.scroll({top:0,behavior:'smooth'})} />
            </Grid>
        </Grid>
    );
}