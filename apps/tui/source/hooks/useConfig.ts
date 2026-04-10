import { useState, useEffect, useCallback } from "react";
import { getConfig, updateConfig } from "@spiderq/core/config";
import type { Config } from "@spiderq/core/types";

interface UseConfigResult {
  config: Config | null;
  loading: boolean;
  updateConfig: (newConfig: Partial<Config>) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

export function useConfig(): UseConfigResult {
  const [config, setConfigState] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      const loadedConfig = await getConfig();
      setConfigState(loadedConfig);
    } catch (err) {
      console.error("Failed to load config:", err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const loadedConfig = await getConfig();
        if (!cancelled) {
          setConfigState(loadedConfig);
        }
      } catch (err) {
        console.error("Failed to load config:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function updateConfigFn(newConfig: Partial<Config>) {
    const updated = await updateConfig(newConfig);
    setConfigState(updated);
  }

  return { config, loading, updateConfig: updateConfigFn, refreshConfig };
}