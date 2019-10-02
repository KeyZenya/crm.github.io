import { Route } from 'react-router-dom';
import NotFound from '../pages/NotFound/NotFound';
import React from 'react';

export const createNotFoundRoute = () => <Route exact component={NotFound} />;
