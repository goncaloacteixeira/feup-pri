import React from "react";
import "./App.css";

import MovieCard from "./components/MovieCard";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/movies/search/spider+man")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [])

  return (
    <div className="App">
      {!data ? 'Loading...' : data.map(x => <MovieCard key={x.imdb_title_id} movie={x}/>)}
    </div>
  );
}

export default App;