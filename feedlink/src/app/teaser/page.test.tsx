import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

jest.mock('next/image', () => {
  const MockImage = ({
    fill,
    alt,
    style,
    ...rest
  }: React.ComponentProps<'img'> & { fill?: boolean }) => {
    if (fill) {
      return (
        <img
          {...rest}
          alt={alt}
          style={{
            ...style,
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          data-testid="mock-image"
        />
      );
    }
    return <img {...rest} alt={alt} data-testid="mock-image" />;
  };

  MockImage.displayName = 'MockImage';
  return {
    __esModule: true,
    default: MockImage,
  };
});

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));


describe('Home (Teaser Page)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the teaser image initially', () => {
    render(<Home />);
    expect(screen.getByAltText('Teaser with phone and groceries')).toBeInTheDocument();
  });

  it('navigates to /choice after ~3550ms', async () => {
    render(<Home />);

    expect(mockPush).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(3550);
    });

    expect(mockPush).toHaveBeenCalledWith('/choice');
  });
});