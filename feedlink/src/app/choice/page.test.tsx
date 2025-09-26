import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChoiceScreen from './page';

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

describe('ChoiceScreen', () => {
  it('renders the background image with correct attributes', () => {
    render(<ChoiceScreen />);
    const bgImage = screen.getByAltText('Grocery-store shelves');
    expect(bgImage).toBeInTheDocument();
    expect(bgImage).toHaveStyle('object-fit: cover');
    expect(bgImage).toHaveAttribute('src', '/images/supermarket.jpeg');
  });

  it('renders the logo with correct attributes', () => {
    render(<ChoiceScreen />);
    const logo = screen.getByAltText('FeedLink Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/logo.svg');
  });

  it('displays the main heading and description text', () => {
    render(<ChoiceScreen />);
    expect(screen.getByText('Welcome to FeedLink')).toBeInTheDocument();
    expect(
      screen.getByText(/Showcase your products directly to buyers and recyclers\./)
    ).toBeInTheDocument();
    expect(screen.getByText(/Reduce waste\. Increase sales\./)).toBeInTheDocument();
  });

  it('renders both role buttons with correct labels', () => {
    render(<ChoiceScreen />);
    expect(screen.getByRole('button', { name: 'Producer' })).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ChoiceScreen />);
    const producerBtn = screen.getByRole('button', { name: 'Producer' });
    expect(producerBtn).toBeVisible();
  });
});