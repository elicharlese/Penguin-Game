import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

// Mock the 3D engine to avoid pulling in heavy WebGL deps during tests
vi.mock('@penguin-surf/game-engine', () => ({
  GameEngine: () => <div data-testid="game-engine" />,
}));

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should show the main menu prompt', () => {
    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(getByText('Start Your Adventure')).toBeTruthy();
  });
});
