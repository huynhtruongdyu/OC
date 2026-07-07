import { showToast } from '@/lib';

export const onRejected = (
  error: Error & {
    response?: { status: number; data: { title?: string; message?: string } };
  },
) => {
  if (error.response) {
    const message =
      error.response.data?.title ??
      error.response.data?.message ??
      error.message;
    if (error.response.status !== 401) {
      showToast.error(message);
    }
  } else {
    showToast.error(error.message);
  }
  return Promise.reject(error);
};
