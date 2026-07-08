export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'VendorsOnline',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  enableMocks: import.meta.env.VITE_ENABLE_MOCKS !== 'false',
  escrowSimulation: import.meta.env.VITE_ESCROW_SIMULATION !== 'false',
}

