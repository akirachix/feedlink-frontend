import { resetPasswordApi } from './fetchResetPassword';

describe('resetPasswordApi', () => {
  const baseUrl = '/api/reset-password';

  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('should reset password successfully when valid email and matching passwords', async () => {
    localStorage.setItem('forgotEmail', 'semhal@gmail.com');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ message: 'Password reset successful' })),
      } as Response),
    );

    const data = await resetPasswordApi('semhal1234', 'semhal1234');
    expect(data).toEqual({ message: 'Password reset successful' });
    expect(global.fetch).toHaveBeenCalledWith(baseUrl, expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        email: 'semhal@gmail.com',
        password: 'semhal1234',
        confirmPassword: 'semhal1234',
      }),
    }));
  });

  it('should throw error if no email in localStorage', async () => {
    await expect(resetPasswordApi('pwd', 'pwd')).rejects.toThrow(
      'No email found. Please restart the reset process.',
    );
  });

  it('should throw error on invalid JSON response', async () => {
    localStorage.setItem('forgotEmail', 'semhal@gmail.com');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('Invalid JSON'),
      } as Response),
    );

    await expect(resetPasswordApi('pwd', 'pwd')).rejects.toThrow('Invalid JSON');
  });

  it('should throw error with API error message', async () => {
    localStorage.setItem('forgotEmail', 'semhal@gmail.com');

    const errorResponse = { detail: 'Passwords do not match' };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      } as Response),
    );

    await expect(resetPasswordApi('pwd1', 'pwd2')).rejects.toThrow('Passwords do not match');
  });

  it('should throw generic error if no detail message in error response', async () => {
    localStorage.setItem('forgotEmail', 'semhal@gmail.com');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify({})),
      } as Response),
    );

    await expect(resetPasswordApi('pwd1', 'pwd2')).rejects.toThrow('Failed to reset password');
  });
});
