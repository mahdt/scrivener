import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NewMatches from './NewMatches.js';
import Results from './Results.js';
import Loader from '../components/Loader.js';
import Summary from './Summary.js';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Summary}/>
      <Route path='/newmatches' component={NewMatches}/>
      <Route path='/loader' component={Results}/>
    </Switch>
  </main>
)

export default Main