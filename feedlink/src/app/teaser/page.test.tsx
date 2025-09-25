import { render, screen, act } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import Home from './page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, priority, ...rest } = props;
    if (fill) {
      return (
        <img{...rest} style={{ ...rest.style,    position: 'absolute',    width: '100%',    height: '100%',  }}  alt={rest.alt} />
      );
    }
    return <img {...rest} alt={rest.alt} />;
  },
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../choice/page', () => {
  return () => <div data-testid="choice-page">Choice Page Content</div>;
});

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

  it('shows ChoicePage after 3050ms and navigates to /choice after 3550ms', async () => {
    render(<Home />);

    expect(screen.queryByTestId('choice-page')).not.toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(3050);
    });

    expect(screen.getByTestId('choice-page')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(mockPush).toHaveBeenCalledWith('/choice');
  });
});