import React, { Suspense, lazy } from 'react';
import { Routes as DomRoutes, Route } from 'react-router-dom';

// eslint-disable-next-line rulesdir/forbid-pf-relative-imports
import { Bullseye, Spinner } from '@patternfly/react-core';

const DefaultLocked = lazy(() => import(/* webpackChunkName: "DefaultLocked" */ './Routes/DefaultLocked/DefaultLocked'));
const Interactive = lazy(() => import(/* webpackChunkName: "Interactive" */ './Routes/Interactive/Interactive'));
const NotFound = lazy(() => import(/* webpackCunkName: "NotFound" */ './Routes/404/404'));

const Routes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <DomRoutes>
      <Route path="/" element={<DefaultLocked />} />
      <Route path="/default-locked" element={<DefaultLocked />} />
      <Route path="/interactive" element={<Interactive />} />
      <Route path="*" element={<NotFound />} />
    </DomRoutes>
  </Suspense>
);

export default Routes;
