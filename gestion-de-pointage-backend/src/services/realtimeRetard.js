let clients = [];

// Fonction pour initialiser les événements SSE
const setupRealtimeRetard = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
};

// Fonction pour notifier tous les clients
const notifyClients = (data) => {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

// Simulation d'envoi des retards toutes les 30 secondes
setInterval(() => {
  const mockData = {
    estEnRetard: true,
    heuresRetard: 1,
    minutesRetard: 15,
    secondesRetard: 30,
    heureArrivee: new Date(),
  };
  notifyClients(mockData);
}, 30000);

module.exports = {
  setupRealtimeRetard,
};
