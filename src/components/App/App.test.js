import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const StubMain = () => <div data-testid="main-view" />;

const buildRouter = (initialPath) => (
  <MemoryRouter initialEntries={[initialPath]}>
    <Routes>
      <Route path={ROUTES.HOME} element={<StubMain />} />
      <Route path={ROUTES.MAIN} element={<StubMain />} />
      <Route path="*" element={<Navigate to={ROUTES.MAIN} />} />
    </Routes>
  </MemoryRouter>
);

describe('ROUTES constants', () => {
  test('MAIN is the root path', () => {
    expect(ROUTES.MAIN).toBe('/');
  });

  test('HOME is a non-root absolute path', () => {
    expect(ROUTES.HOME).toMatch(/^\//);
    expect(ROUTES.HOME).not.toBe('/');
  });
});

describe('App routing', () => {
  test('root path renders the main view', () => {
    render(buildRouter('/'));
    expect(screen.getByTestId('main-view')).toBeInTheDocument();
  });

  test('HOME path renders the main view', () => {
    render(buildRouter(ROUTES.HOME));
    expect(screen.getByTestId('main-view')).toBeInTheDocument();
  });

  test('unknown path redirects to MAIN and renders the main view', () => {
    render(buildRouter('/something-unknown'));
    expect(screen.getByTestId('main-view')).toBeInTheDocument();
  });

  test('wildcard redirect target is the root path', () => {
    expect(ROUTES.MAIN).toBe('/');
  });
});
