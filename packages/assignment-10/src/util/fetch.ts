export const createCachedFetcher = <T>(fetcher: () => Promise<T>) => {
  let cache: T | null = null;
  return async () => {
    if (!cache) {
      cache = await fetcher();
    }
    return cache;
  };
};
