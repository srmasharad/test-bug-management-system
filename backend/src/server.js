const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDatabase } = require("./config/database");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.json({ status: "ok", database: "PostgreSQL" });
});

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

initDatabase()
  .then(async () => {
    if (process.env.SEED_DATA === "true") {
      const { seedData } = require("./seedData");
      await seedData();
      console.log("✓ Database seeded successfully");
    }

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize:", err);
    process.exit(1);
  });

module.exports = app;
