// require("dotenv").config()
// const dns = require("dns")
// dns.setServers(["8.8.8.8","8.8.4.4"])

// const app = require("./src/app")
// const connectToDB = require("./src/config/database")
// const { resume, selfDescription,jobDescription} = require("./src/services/temp.js")
// const generateInterviewReport = require("./src/services/ai.service")
// connectToDB()


// generateInterviewReport({ resume, selfDescription, jobDescription})
// app.listen(3000,() => {
//     console.log("Server is running on the port 3000")
// })

// require("dotenv").config();
// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const app = require("./src/app");
// const connectToDB = require("./src/config/database");
// const { resume, selfDescription, jobDescription } = require("./src/services/temp"); // Path check kar lein
// const {generateInterviewReport} = require("./src/services/ai.service");

// connectToDB();

// app.listen(3000, async () => {
//     console.log("Server is running on port 3000");

//     // Async call handling
//     try {
//         const report = await generateInterviewReport({ resume, selfDescription, jobDescription });
//         console.log(report);
//     } catch (err) {
//         console.error("AI Generation Error:", err);
//     }
// });
// require("dotenv").config();
// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const app = require("./src/app");
// const connectToDB = require("./src/config/database");

// // Correct imports

// connectToDB();

// app.listen(3000, async () => {
//   console.log("Server is running on port 3000");

// })
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = require("./src/app");
const connectToDB = require("./src/config/database");

async function startServer() {
  try {
    await connectToDB();
  } catch (err) {
    console.warn("MongoDB connection unavailable. Starting API without a database connection.");
    console.warn(err.message || err);
  }

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

startServer();