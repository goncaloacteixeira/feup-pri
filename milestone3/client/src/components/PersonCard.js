import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Grid} from "@mui/material";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function PersonCard(props) {
    const [expanded, setExpanded] = React.useState(false);
    const [data, setData] = React.useState(null);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    React.useEffect(() => {
        fetch('/api/person/' + props.person.imdb_name_id)
            .then((res) => res.json())
            .then((data) => setData(data.message));
    })

    return (
        <Card>
            <Grid container>
                <Grid item xs={2} align="center">
                    {!data ? 'loading...' :
                        <img
                            height="auto"
                            width="100%"
                            src={"https://image.tmdb.org/t/p/w185" + data.profile_path}
                            alt={props.person.name + " picture"}
                        />
                    }
                </Grid>
                <Grid item xs={10}>
                    <CardContent>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h6">
                                    {!data ? 'loading...' : data.name}
                                </Typography>
                                <Typography variant="h7" color="text.secondary">
                                    {props.person.birth_name}
                                </Typography>
                            </Grid>
                            <Grid item align="right">
                                <Typography variant="h6">
                                    {props.person.role}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography textAlign="justify" variant="body1">
                            {!data ? props.person.bio : (data.biography ? data.biography : props.person.bio)}
                        </Typography>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
}
