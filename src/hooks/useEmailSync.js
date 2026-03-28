import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');

const buildAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseErrorMessage = async (response, fallbackMessage) => {
  try {
    const payload = await response.json();
    return payload?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

export function useEmailSync() {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async (page = 1, limit = 20) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/v2/email-sync/status?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          ...buildAuthHeaders(),
        },
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response, 'Failed to fetch email sync status.');
        throw new Error(message);
      }

      const payload = await response.json();
      if (!payload?.success) {
        throw new Error(payload?.message || 'Failed to fetch email sync status.');
      }

      setConnected(Boolean(payload?.data?.connected));
      setLogs(payload?.data?.logs || []);
      setTotal(payload?.data?.total || 0);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to fetch email sync status.');
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('email_sync');
    if (!result) {
      return;
    }

    if (result === 'success') {
      fetchStatus();
    }

    if (result === 'error') {
      const reason = params.get('reason') || 'unknown error';
      setError(`Gmail connection failed: ${reason}`);
    }

    window.history.replaceState({}, '', window.location.pathname);
  }, [fetchStatus]);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/v2/email-sync/auth`, {
        method: 'GET',
        headers: {
          ...buildAuthHeaders(),
        },
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response, 'Failed to start Gmail connection.');
        throw new Error(message);
      }

      const payload = await response.json();
      if (!payload?.success) {
        throw new Error(payload?.message || 'Failed to start Gmail connection.');
      }

      const authUrl = payload?.data?.auth_url;
      if (!authUrl) {
        throw new Error('OAuth URL not returned by server.');
      }

      window.open(authUrl, '_blank', 'noopener,noreferrer');
    } catch (connectError) {
      setError(connectError.message || 'Failed to start Gmail connection.');
    } finally {
      setConnecting(false);
    }
  }, []);

  const sync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    setSyncResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/v2/email-sync/sync`, {
        method: 'POST',
        headers: {
          ...buildAuthHeaders(),
        },
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response, 'Failed to run email sync.');
        throw new Error(message);
      }

      const payload = await response.json();
      if (!payload?.success) {
        throw new Error(payload?.message || 'Failed to run email sync.');
      }

      setSyncResult(payload?.data || null);
      await fetchStatus();
    } catch (syncError) {
      setError(syncError.message || 'Failed to run email sync.');
    } finally {
      setSyncing(false);
    }
  }, [fetchStatus]);

  const disconnect = useCallback(async () => {
    setDisconnecting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/v2/email-sync/disconnect`, {
        method: 'DELETE',
        headers: {
          ...buildAuthHeaders(),
        },
      });

      if (!response.ok) {
        const message = await parseErrorMessage(response, 'Failed to disconnect Gmail account.');
        throw new Error(message);
      }

      setConnected(false);
      setLogs([]);
      setTotal(0);
      setSyncResult(null);
    } catch (disconnectError) {
      setError(disconnectError.message || 'Failed to disconnect Gmail account.');
    } finally {
      setDisconnecting(false);
    }
  }, []);

  return {
    connected,
    logs,
    total,
    syncing,
    connecting,
    disconnecting,
    syncResult,
    error,
    connect,
    sync,
    disconnect,
    fetchStatus,
  };
}
