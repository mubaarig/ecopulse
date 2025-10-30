import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';

import { LazyLoad } from './lazy-load';

// Store the original IntersectionObserver to restore it after tests
const originalIntersectionObserver = global.IntersectionObserver;

describe('LazyLoad', () => {
  let observe: ReturnType<typeof vi.fn>;
  let disconnect: ReturnType<typeof vi.fn>;
  let triggerIntersection: (isIntersecting: boolean) => void;

  beforeEach(() => {
    // Mock IntersectionObserver implementation
    observe = vi.fn();
    disconnect = vi.fn();
    triggerIntersection = () => {};

    // Replace global IntersectionObserver with mock
    (
      global as unknown as { IntersectionObserver: typeof IntersectionObserver }
    ).IntersectionObserver = vi.fn((callback) => {
      // Create trigger function to simulate intersection changes
      triggerIntersection = (isIntersecting: boolean) => {
        callback([
          {
            isIntersecting,
            target: document.createElement('div'),
            intersectionRatio: isIntersecting ? 1 : 0,
            time: 0,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
          } as IntersectionObserverEntry,
        ]);
      };

      // Return mock observer instance
      return {
        observe,
        disconnect,
        takeRecords: vi.fn(),
        unobserve: vi.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      };
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    // Restore original IntersectionObserver after each test
    if (originalIntersectionObserver) {
      (
        global as unknown as { IntersectionObserver: typeof IntersectionObserver }
      ).IntersectionObserver = originalIntersectionObserver;
    } else {
      delete (global as Record<string, unknown>).IntersectionObserver;
    }

    vi.clearAllMocks();
  });

  it('keeps children hidden until the container intersects the viewport', () => {
    // Render LazyLoad component with children
    render(
      <LazyLoad>
        <span>Loaded content</span>
      </LazyLoad>,
    );

    // Verify observer was set up but content isn't visible yet
    expect(observe).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Loaded content')).not.toBeInTheDocument();

    // Simulate intersection event
    act(() => triggerIntersection(true));

    // Verify content is now visible and observer was disconnected
    expect(screen.getByText('Loaded content')).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();
  });

  it('disconnects the observer on unmount', () => {
    // Render component and get unmount function
    const { unmount } = render(
      <LazyLoad>
        <span>Loaded content</span>
      </LazyLoad>,
    );

    // Verify observer hasn't been disconnected yet
    expect(disconnect).not.toHaveBeenCalled();

    // Trigger component unmount
    unmount();

    // Verify observer was properly disconnected
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
