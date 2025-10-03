export const SERVER_BATCH_JOB = (uri: string) => {
  return import.meta.env.VITE_SERVER_BATCH_JOB + uri;
};
