import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Csv from './index';

jest.mock('../../../utils/fetchCsvUpload', () => ({
  uploadCsvFile: jest.fn(),
}));

const mockUploadCsvFile = require('../../../utils/fetchCsvUpload').uploadCsvFile;

describe('Csv', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getFileInput = (container: HTMLElement): HTMLInputElement => {
    const input = container.querySelector('input[type="file"]');
    if (!input) throw new Error('File input not found');
    return input as HTMLInputElement;
  };

  it('renders upload form with file input and buttons', () => {
    const { container } = render(<Csv onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    expect(screen.getByText('Upload CSV File')).toBeInTheDocument();
    expect(getFileInput(container)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('uploads file successfully and calls onSuccess', async () => {
    const file = new File(['id,name\n1,item'], 'test.csv', { type: 'text/csv' });
    mockUploadCsvFile.mockResolvedValue(undefined);

    const { container } = render(<Csv onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const fileInput = getFileInput(container);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(mockUploadCsvFile).toHaveBeenCalledWith(file);
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('shows error when no file is selected', () => {
    render(<Csv onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));
    expect(screen.getByText('Please select a CSV file to upload.')).toBeInTheDocument();
  });

  it('shows error when upload fails', async () => {
    const file = new File(['id,name\n1,item'], 'test.csv', { type: 'text/csv' });
    mockUploadCsvFile.mockRejectedValue(new Error('Network error'));

    const { container } = render(<Csv onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const fileInput = getFileInput(container);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('disables buttons while loading', async () => {
    const file = new File(['id,name\n1,item'], 'test.csv', { type: 'text/csv' });
    mockUploadCsvFile.mockImplementation(() => new Promise(() => {}));

    const { container } = render(<Csv onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const fileInput = getFileInput(container);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadBtn = screen.getByRole('button', { name: /upload/i });
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(uploadBtn);

    await waitFor(() => {
      expect(uploadBtn).toBeDisabled();
      expect(cancelBtn).toBeDisabled();
      expect(uploadBtn).toHaveTextContent('Uploading...');
    });
  });

  it('calls onCancel', () => {
    render(<Csv onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});