export type SocketResponseData<T> = {
  status: 'success' | 'error';
  data: T;
};
