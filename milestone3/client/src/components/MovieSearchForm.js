import {
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";

const customData = require("./data.json");

const Input = styled("input")({
  display: "none",
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MovieSearchForm(props) {
  const [data, setData] = React.useState({
    query: "*",
    language: [],
    genre: [],
    start_year: "*",
    end_year: "*",
    sort: "",
    direction: "ASC",
  });

  const onQueryChange = (e) =>
    setData({
      ...data,
      query: e.target.value.trim() === "" ? "*" : e.target.value,
    });
  const onStartYearChange = (e) =>
    setData({
      ...data,
      start_year: e.target.value === "" ? "*" : e.target.value,
    });
  const onEndYearChange = (e) =>
    setData({
      ...data,
      end_year: e.target.value === "" ? "*" : e.target.value,
    });
  const onSortChange = (e) => setData({ ...data, sort: e.target.value });
  const onDirectionChange = (e) =>
    setData({ ...data, direction: e.target.value });

  const onLanguageChange = (event) => {
    const {
      target: { value },
    } = event;
    setData(
      // On autofill we get a the stringified value.
      {
        ...data,
        language: typeof value === "string" ? value.split(",") : value,
      }
    );
  };

  const onGenreChange = (event) => {
    const {
      target: { value },
    } = event;
    setData(
      // On autofill we get a the stringified value.
      { ...data, genre: typeof value === "string" ? value.split(",") : value }
    );
  };

  return (
    <Grid
      component="form"
      onSubmit={props.handleSubmit(data)}
      p={3}
      container
      spacing={3}
    >
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel name="query" htmlFor="search-query">
            Search
          </InputLabel>
          <OutlinedInput
            onChange={onQueryChange}
            id="search-query"
            label="Search"
          />
        </FormControl>
      </Grid>

      {/*Genre*/}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="search-genre-label">Genre</InputLabel>
          <Select
            labelId="search-genre-label"
            id="search-genre"
            multiple
            value={data.genre}
            onChange={onGenreChange}
            input={<OutlinedInput id="search-genre" label="Genre" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {customData.genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-chip-label">Language</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={data.language}
            onChange={onLanguageChange}
            input={<OutlinedInput id="select-multiple-chip" label="Language" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {customData.languages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* YEARS */}
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor="search-start-year">Start Year</InputLabel>
          <OutlinedInput
            type="number"
            onChange={onStartYearChange}
            id="search-start-year"
            label="Start Year"
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor="search-end-year">End Year</InputLabel>
          <OutlinedInput
            type="number"
            onChange={onEndYearChange}
            id="search-end-year"
            label="End Year"
          />
        </FormControl>
      </Grid>

      {/* Sorting */}
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel id="search-sort-label">Sort</InputLabel>
          <Select
            labelId="search-sort-label"
            label="Sort"
            value={data.sort}
            onChange={onSortChange}
          >
            <MenuItem value={""}>Default</MenuItem>
            <MenuItem value={"original_title"}>Title</MenuItem>
            <MenuItem value={"year"}>Year</MenuItem>
            <MenuItem value={"weighted_average_vote"}>Rating</MenuItem>
            <MenuItem value={"total_votes"}>Votes</MenuItem>
            <MenuItem value={"duration"}>Duration</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel id="search-direction-label">Direction</InputLabel>
          <Select
            labelId="search-direction-label"
            label="Direction"
            value={data.direction}
            onChange={onDirectionChange}
          >
            <MenuItem value={"ASC"}>Ascending</MenuItem>
            <MenuItem value={"DESC"}>Descending</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} align="right">
        <label htmlFor="search-button">
          <Input id="search-button" type="submit" />
          <IconButton color="primary" aria-label="Search" component="span">
            <SearchIcon />
          </IconButton>
        </label>
      </Grid>
    </Grid>
  );
}
