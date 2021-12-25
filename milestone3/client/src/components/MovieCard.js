import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Grid} from "@mui/material";
import GenreChip from "./GenreChip";
import StarIcon from '@mui/icons-material/Star';
import MovieModal from "./MovieModal";
import Button from "@mui/material/Button";

const ExpandMore = styled((props) => {
  const {expand, ...other} = props;
  return <IconButton {...other} />;
})(({theme, expand}) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function MovieCard(props) {
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
      <div>
        <MovieModal open={open} movie={props.movie} onClose={handleClose} />
        <Card align="start">
          <CardContent>
            <Grid alignItems="center" container py={1} justifyContent="space-between">
              <Grid align="left" item>
                <Grid item>
                  <Typography variant="h4">
                    {props.movie.original_title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2" color="text.secondary">
                    {props.movie.duration}m {props.movie.year}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={1}>
                    {props.movie.genre.map(x => {
                      return (
                          <Grid item key={props.movie.imdb_title_id + "_" + x}>
                            <GenreChip genre={x}/>
                          </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid item textAlign="end">
                  <Grid display="flex" alignItems="center" item>
                    <Grid container direction="row" align="center" alignItems="center">
                      <Grid item>
                        <StarIcon/>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6">
                          {props.movie.weighted_average_vote}/10.0
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    {props.movie.total_votes} votes
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
            <Typography align="left" variant="body1">
              {props.movie.description}
            </Typography>
          </CardContent>
          { !props.movie.plot ?
              <CardActions disableSpacing>
                <Button onClick={handleOpen} size="small">More</Button>
              </CardActions>
              : (<CardActions disableSpacing>
            <Button onClick={handleOpen} size="small">More</Button>
            <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
            >
              <ExpandMoreIcon/>
            </ExpandMore>
          </CardActions>)}
          { !props.movie.plot ? "" : (
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <Typography align="left" paragraph>
                    {props.movie.plot}
                  </Typography>
              </Collapse>) }
        </Card>
      </div>
  );
}
