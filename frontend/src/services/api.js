export const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Verification failed');
  }
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const registerEwasteDevice = async (deviceData, token) => {
  const response = await fetch('/api/devices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(deviceData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

export const getDashboardStats = async (token) => {
  const response = await fetch('/api/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

// Phase 5 API Services

export const getMyDevices = async (token) => {
  const response = await fetch('/api/devices', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

export const getCollectionCenters = async () => {
  const response = await fetch('/api/centers');
  return await response.json();
};

export const schedulePickup = async (pickupData, token) => {
  const response = await fetch('/api/pickups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pickupData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getWalletData = async (token) => {
  const response = await fetch('/api/wallet', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

export const requestWithdrawal = async (withdrawData, token) => {
  const response = await fetch('/api/wallet/withdraw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(withdrawData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

// Phase 6 Admin API Services

export const getAdminStats = async (token) => {
  const response = await fetch('/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

export const getAdminWithdrawals = async (token) => {
  const response = await fetch('/api/admin/withdrawals', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

export const getAdminUsers = async (token) => {
  const response = await fetch('/api/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

export const getAdminDevices = async (token) => {
  const response = await fetch('/api/admin/devices', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

export const approveWithdrawal = async (id, status, token) => {
  const response = await fetch(`/api/admin/withdrawals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getAdminPickups = async (token) => {
  const response = await fetch('/api/admin/pickups', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};

export const completePickup = async (id, token) => {
  const response = await fetch(`/api/admin/pickups/${id}/complete`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

// Collection Center Admin API Services

export const createCollectionCenter = async (centerData, token) => {
  const response = await fetch('/api/centers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(centerData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const deleteCollectionCenter = async (id, token) => {
  const response = await fetch(`/api/centers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const cancelDevice = async (id, token) => {
  const response = await fetch(`/api/devices/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const confirmDropoff = async (id, token) => {
  const response = await fetch(`/api/admin/devices/${id}/confirm-dropoff`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};


