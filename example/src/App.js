import React from 'react';
import './App.scss';
import { useMachine } from './machines/useMachine';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Gallery from './machines/gallery';
import Search from './machines/search';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faBinoculars, faBullseye } from '@fortawesome/free-solid-svg-icons';
library.add(faSpinner, faBinoculars, faBullseye);


const App = () => {

  const [feed, load] = useMachine(Gallery);
  const [sInput, type] = useMachine(Search);

  const disableForm = (input) => (!input.value || !input.value.text || !input.value.text.length);

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className="justify-content-between">
        <Navbar.Brand>
          <FontAwesomeIcon icon="binoculars" /> Sherlock
        </Navbar.Brand>
        <Form inline onSubmit={(e) => { e.preventDefault(); !disableForm(sInput) && load('LOAD', { username: sInput.value.text }); }}>
          <Form.Control placeholder="Unsplash Username"
            disabled={feed.is('loading') || feed.is('loadingMore')}
            value={(sInput.value && sInput.value.text) || ''}
            onInput={(e) => (type('TYPE', { text: e.currentTarget.value }))}
          />
          <Button disabled={disableForm(sInput)}
            onClick={() => (load('LOAD', { username: sInput.value.text }))} variant="dark">
            <FontAwesomeIcon icon="bullseye" /> Load
            </Button>
        </Form>
      </Navbar>
      <Container fluid="xl" className="mt-3">
        {feed && feed.is('waiting') &&
          <Jumbotron>
            <h1>Start use Sherlock</h1>
            <p>By enter your Unsplash username in navbar</p>
          </Jumbotron>
        }
        {feed && feed.is('feed') && feed.value.photos.length === 0 &&
          <Jumbotron>
            <h1>No images found for user {feed.value.username}</h1>
          </Jumbotron>
        }
        {feed && (feed.is('feed') || feed.is('loadingMore')) && feed.value.photos.length > 0 &&
          <Container>
            <div className="masonry">
              {feed.value.photos.map((p) => (
                <div className="brick photo-pile" key={p.id}>
                  <img src={p.urls.small} style={{ width: '100%' }} alt={p.description} />
                  <div className="placeholder p-2">
                    <span className="duplicates">
                      <span className="number">{Math.floor(Math.random() * (1000 - 0 + 1)) + 0}</span>
                      Occurrences found
                    </span>
                    <Button variant="outline-light">Learn More</Button>
                  </div>
                </div>
              ))}
            </div>
            {feed.value.total > feed.value.photos.length &&
              <p className="text-center">
                <Button disabled={feed.is('loadingMore')} variant="outline-dark" onClick={() => (load('LOAD_MORE', { ...feed.value }))}>
                  {feed.is('feed') && 'Load More'}
                  {feed.is('loadingMore') && <FontAwesomeIcon icon="spinner" spin />}
                </Button>
              </p>
            }
          </Container>
        }
        {feed && feed.is('loading') &&
          <p className="text-center">
            <FontAwesomeIcon icon="spinner" spin size="10x" />
          </p>
        }
        {feed && feed.is('notFound') &&
          <Jumbotron>
            <h1>User {feed.value.username} not found</h1>
            <p>Try search for something else</p>
          </Jumbotron>
        }
        {feed && feed.is('error') && feed.value.error &&
          <Jumbotron>
            <p>{JSON.stringify(feed.value.error)}</p>
          </Jumbotron>
        }
      </Container>
    </div >
  );
}

export default App;
