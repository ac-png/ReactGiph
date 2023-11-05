import axios from "axios";
import { useState, useEffect } from "react";
import { Card, Row, Button, Dropdown, DropdownButton } from "react-bootstrap";

const GIPHY_URL = "https://api.giphy.com/v1/gifs";
const API_KEY = "OvYUI96zJEvzEVywa8PdT9AqvTT75Eu5";
const LIMIT = 10;

const GiphyViewer = () => {
  const [gifs, setGifs] = useState([]);
  const [term, setTerm] = useState("");
  const [limit, setLimit] = useState(15);

  useEffect(() => {
    getTrending();
  }, []);

  const handleTrendingClick = () => {
    getTrending();
  };

  const handleSelect = (amount) => {
    setLimit(amount);
  };

  const getTrending = () => {
    axios
      .get(`${GIPHY_URL}/trending?api_key=${API_KEY}&limit=${limit}`)
      .then((response) => {
        setGifs(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setTerm(e.target.value);
  };

  const handleClick = () => {
    searchGif();
  };

  const handleRandomClick = () => {
    axios
    .get(`${GIPHY_URL}/random?api_key=${API_KEY}&q=${term}&limit=${limit}`)
    .then((response) => {
      setGifs([response.data.data]);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const handleKeyUp = (e) => {
    // Only searches when enter is pressed, not while typing
    if (e.key === "Enter") {

      searchGif();
    }
  };

  const searchGif = () => {
    if (!term) {
      alert("Please enter a search term");
      return;
    }

    axios
      .get(`${GIPHY_URL}/search?api_key=${API_KEY}&q=${term}&limit=${limit}`)
      .then((response) => {
        setGifs(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setTerm("");
  };

  const gifComponents = gifs.map((g) => {
    return (
      <div>
        <GIFCard
          key={g.id}
          title={g.title}
          url={g.url}
          image={g.images.fixed_width.url}
        />
      </div>
    );
  });

  return (
    <>
      <div className="search">
        <input className="me-2" type="text" value={term} onChange={handleChange} onKeyUp={handleKeyUp}/>
        <Button className="me-2" variant="primary" onClick={handleClick}>Search</Button>
        <Button className="me-2" variant="info" onClick={handleTrendingClick}>Trending</Button>
        <Button className="me-2" variant="warning" onClick={handleRandomClick}>Random</Button>
        <DropdownButton onSelect={handleSelect} size="sm" id="dropdown-basic-button" title="Limit" variant="secondary">
          <Dropdown.Item eventKey={15}>15</Dropdown.Item>
          <Dropdown.Item eventKey={20}>20</Dropdown.Item>
          <Dropdown.Item eventKey={25}>25</Dropdown.Item>
          <Dropdown.Item eventKey={50}>50</Dropdown.Item>
        </DropdownButton>
      </div>
      <Row className="g-4" md={3} xs={1}>
        {gifComponents}
      </Row>
    </>
  );
};

export const GIFCard = (props) => {
  return (
    <Card>
      <Card.Img variant="top" src={props.image} />
      <Card.Body>
        <Card.Title>
          <a href={props.url} target="_blank">
            {props.title}
          </a>
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default GiphyViewer;
