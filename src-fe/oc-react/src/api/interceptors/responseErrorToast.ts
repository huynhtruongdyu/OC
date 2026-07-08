import { showToast } from '@/lib';

export const onRejected = (
  error: Error & {
    response?: { status: number; data: { title?: string; message?: string } };
  },
) => {
  if (error.response) {
    if (error.response.status === 403) {
      showToast.error('You do not have permission to perform this action');
    } else if (error.response.status !== 401) {
      const message =
        error.response.data?.title ??
        error.response.data?.message ??
        error.message;
      showToast.error(message);
    }
  } else {
    showToast.error(error.message);
  }
  return Promise.reject(error);
};
