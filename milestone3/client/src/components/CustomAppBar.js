import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import React from "react";
import {Grid, Link, MenuItem} from "@mui/material";

const CustomAppBar = ({drawerWidth}) => (
    <AppBar
        position="fixed"
        sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}
    >
        <Toolbar>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <Typography variant="h6" noWrap component="div">
                        POPCORN TIME
                    </Typography>
                </Grid>
                <Grid item>
                    <MenuItem>
                        <Link style={{color: 'white'}} href="/movies" textAlign="center">Movies</Link>
                    </MenuItem>
                </Grid>
                <Grid item>
                    <MenuItem>
                        <Link style={{color: 'white'}} href="/people" textAlign="center">People</Link>
                    </MenuItem>
                </Grid>
            </Grid>

        </Toolbar>
    </AppBar>
)

export default CustomAppBar;