const express = require("express");

const app = express();
const port = 3000;
let time = 60000;
let intervalId;
// URLs to fetch data from

// Function to fetch data from the URLs
let urls
async function fetchData() {
  try {
    try{
      urls = await (
        await fetch(
          "https://raw.githubusercontent.com/raj6784/cron_api/main/cron_api.json",
          { method: "GET", mode: "cors" }
        ).then()
      ).json();
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
    console.log(`Data triggered every ${time/60000} Minutes`);
  }, time);
}

startDataFetching();

app.use("*", async (req, res) => {
  if(req.query.time === "0"){
      res.json({
        interval_time: `${time / 60000} Minutes`,
        Urls: urls
      });
  }
  else if (req.query.time) {
    const newTime = 60000 * Number(req.query.time);
    if (!isNaN(newTime) && newTime > 0) {
      res.json({Old_interval : `${time/60000} Minutes` , New_interval:`${newTime /60000} Minutes`});

      time = newTime;

      console.log(`New time interval set to ${time / 60000} Minutes`);

      // Clear the existing interval and restart it with the new time
      startDataFetching();
    } else {
      res.status(400).json("Invalid time value. It must be a positive number.");
    }
  } else {
    res.json("Invalid Request.");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
