function getServerUrl() {
  // Get the url based on the current host from the allowed list from env
  const allowedHosts = import.meta.env.VITE_ALLOWED_HOSTS.split(",");
  const currentHost = window.location.host.split(":")[0]; // Get the hostname without port
  const currentProtocol = window.location.protocol;
  const serverPort = import.meta.env.DEV
    ? `:${import.meta.env.VITE_SERVER_PORT}`
    : ""; // Default port if not set
  const isAllowedHost = allowedHosts.some((host: string) => {
    // Check if the current host matches any of the allowed hosts
    return host.trim() === currentHost || host.trim() === "*";
  });
  return isAllowedHost
    ? `${currentProtocol}//${currentHost}${serverPort}/api`
    : "";
}

export const server = {
  baseURL: getServerUrl(),
};
