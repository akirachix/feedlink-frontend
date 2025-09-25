import { verifyCodeApi } from './fetchVerifyCode';

describe('verifyCodeApi', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('resolves with data when response is OK and valid JSON', async () => {
    const mockData = { detail: 'OTP verified.' };


    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      } as Response)
    );
    const data = await verifyCodeApi('semhal@gmail.com', '123456');
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/verifyCode', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'semhal@gmail.com', otp: '123456' }),
    }));
  });
   it('throws error on non-OK response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve(JSON.stringify({ message: 'Bad request' })),
      } as Response)
    );


    await expect(verifyCodeApi('semhal@gmail.com', '123456')).rejects.toThrow('Failed to verify OTP');
  });
  it('throws error on invalid JSON response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('Invalid JSON'),
      } as Response)
    );


    await expect(verifyCodeApi('semhal@gmail.com', '123456')).rejects.toThrow('Invalid JSON response from server: Invalid JSON');
  });


  it('throws error on fetch failure', async () => {
    const fetchError = new Error('Network failure');
    global.fetch = jest.fn(() => Promise.reject(fetchError));
    await expect(verifyCodeApi('semhal@gmail.com', '123456')).rejects.toThrow('Network failure');
  });
});
