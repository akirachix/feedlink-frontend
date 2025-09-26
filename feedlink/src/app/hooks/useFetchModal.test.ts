import { renderHook, act } from '@testing-library/react';
import useModal from './useFetchModal';

describe('useModal', () => {
  it('should initialize with modal closed and no content', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.modalOpen).toBe(false);
    expect(result.current.modalContent).toBeNull();
  });

  it('should open the modal', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.modalOpen).toBe(true);
    expect(result.current.modalContent).toBeNull();
  });

  it('should close the modal and clear content', () => {
    const { result } = renderHook(() => useModal());

    
    act(() => {
      result.current.setModalContent('Test content');
      result.current.openModal();
    });

    expect(result.current.modalOpen).toBe(true);
    expect(result.current.modalContent).toBe('Test content');


    act(() => {
      result.current.closeModal();
    });

    expect(result.current.modalOpen).toBe(false);
    expect(result.current.modalContent).toBeNull();
  });

  it('should allow setting modal content independently', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.setModalContent('Hello world');
    });

    expect(result.current.modalContent).toBe('Hello world');
    expect(result.current.modalOpen).toBe(false); 
  });
});