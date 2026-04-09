import { useState, useEffect } from "react";
import { GlobalConfig, getConfig, setConfig, loadConfig } from "@spiderq/core/config";
import type { Config } from "@spiderq/core/types";

interface UseConfigResult {
  config: Config;
  loading: boolean;
  updateConfig: (newConfig: Partial<Config>) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

export function useConfig(): UseConfigResult {
  const [config, setConfigState] = useState<Config>(GlobalConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await loadConfig();
        if (!cancelled) {
          setConfigState({ ...GlobalConfig });
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

  async function updateConfig(newConfig: Partial<Config>) {
    const updated = { ...config, ...newConfig };
    await setConfig(updated);
    setConfigState(updated);
  }

  async function refreshConfig() {
    await loadConfig();
    setConfigState({ ...GlobalConfig });
  }

  return { config, loading, updateConfig, refreshConfig };
}