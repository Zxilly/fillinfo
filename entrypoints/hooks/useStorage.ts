interface UseStorageHookResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  updateData: (newData: T) => Promise<void>;
}

export function useStorage<T>(
  storageKey: string,
  initialData: T
): UseStorageHookResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await new Promise<T>((resolve, reject) => {
          browser.storage.local.get(storageKey, (items) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }

            const storedData = items[storageKey] ?? initialData;
            resolve(storedData);
          });
        });

        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    loadData();
  }, [storageKey, initialData]);

  const updateData = async (newData: T) => {
    try {
      await new Promise<void>((resolve, reject) => {
        browser.storage.local.set({ [storageKey]: newData }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          setData(newData);
          resolve();
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Update failed'));
    }
  };

  return { data, loading, error, updateData };
}
