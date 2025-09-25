import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomSelect from './index';

const mockOptions = [
  { value: '1', label: 'Option One' },
  { value: '2', label: 'Option Two' },
  { value: '3', label: 'Option Three' },
];

describe('CustomSelect', () => {
  it('renders with placeholder when no value is selected', () => {
    const handleChange = jest.fn();
    render(
      <CustomSelect
        value=""
        onChange={handleChange}
        options={mockOptions}
        placeholder="Select an option"
      />
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('displays selected option label', () => {
    const handleChange = jest.fn();
    render(
      <CustomSelect
        value="2"
        onChange={handleChange}
        options={mockOptions}
      />
    );

    expect(screen.getByText('Option Two')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    const handleChange = jest.fn();
    render(
      <CustomSelect
        value=""
        onChange={handleChange}
        options={mockOptions}
        placeholder="Select"
      />
    );

 
    expect(screen.queryByText('Option One')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByText('Option One')).toBeInTheDocument();
    expect(screen.getByText('Option Two')).toBeInTheDocument();
    expect(screen.getByText('Option Three')).toBeInTheDocument();
  });

  it('calls onChange and closes dropdown when option is selected', () => {
    const handleChange = jest.fn();
    render(
      <CustomSelect
        value=""
        onChange={handleChange}
        options={mockOptions}
        placeholder="Select"
      />
    );


    fireEvent.click(screen.getByText('Select'));
    fireEvent.click(screen.getByText('Option Two'));

    expect(handleChange).toHaveBeenCalledWith('2');
    expect(screen.queryByText('Option One')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const handleChange = jest.fn();
    const { container } = render(
      <div>
        <CustomSelect
          value=""
          onChange={handleChange}
          options={mockOptions}
          placeholder="Select"
        />
        <div id="outside">Outside</div>
      </div>
    );

    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByText('Option One')).toBeInTheDocument();

    fireEvent.mouseDown(container.querySelector('#outside')!);

    await waitFor(() => {
      expect(screen.queryByText('Option One')).not.toBeInTheDocument();
    });
  });

  it('does not close dropdown when clicking inside', () => {
    const handleChange = jest.fn();
    render(
      <CustomSelect
        value=""
        onChange={handleChange}
        options={mockOptions}
        placeholder="Select"
      />
    );


    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByText('Option One')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText('Option Two'));
    expect(screen.getByText('Option One')).toBeInTheDocument();
  });
});
