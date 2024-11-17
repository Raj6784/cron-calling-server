const express = require("express");

const app = express();
const port = 3000;
let time = 60000;
let intervalId;
// URLs to fetch data from

// Function to fetch data from the URLs
async function fetchData() {
  let urls
  try {
    try{
      urls = await (
        await fetch(
          "https://raw.githubusercontent.com/raj6784/cron_api/main/cron_api.json",
          { method: "GET", mode: "cors" }
        ).then()
      ).json();

      console.log("Urls => ", await urls);
    }catch(err){
      console.log("Urls Error =>",err)
    }


    if (urls) {
        urls.map((url, id) => {
          try{
            return fetch(url, { method: "GET", mode: "cors" }).then((res) => res);
          }catch(err){
            console.log("solo Request error =>",err)
          }
        })
    }
  } catch (error) {
    console.log("All function Error =>",error)
  }
  return "Nothing"
}


function startDataFetching() {
  console.log("Interval Triggered")
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(async () => {
    await fetchData();
    console.log(`Data triggered every ${time}ms and  Intervel ID => ${intervalId}`);
  }, time);
}

startDataFetching();

app.use("*", async (req, res) => {
  if (req.query.time) {
    const newTime = Number(req.query.time);
    if (!isNaN(newTime) && newTime > 0) {
      res.json(`Request: Old interval: ${time}ms, New interval: ${newTime}ms`);

      time = newTime;

      console.log(`New time interval set to ${time}ms`);

      // Clear the existing interval and restart it with the new time
      startDataFetching();
    } else {
      res.status(400).json("Invalid time value. It must be a positive number.");
    }
  } else {
    await fetchData();
    res.json("No data available");
    console.log("Triggered data manually");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
