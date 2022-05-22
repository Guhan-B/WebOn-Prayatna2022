import React from "react";
import axios from "axios";

function Exchange() {
    const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Mjg5YmVlNzMwZWEyNzQzZjBjNTFkZjUiLCJ0eXBlIjoiQUNDRVNTIiwidGltZXN0YW1wIjoxNjUzMTk0OTUxNTczLCJpYXQiOjE2NTMxOTQ5NTEsImV4cCI6MTY4NDc1MjU1MX0.LlnDgGDuWvRNl20bYN4nx0jSr6wATW1eEpiemwxySGo";

  const API = "https://api.wazirx.com/sapi/v1/tickers/24hr";
  const [coins, setCoins] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        const c = res.data.splice(0, 5);
        setCoins(c);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const exchange = (e) => {
      e.preventDefault()
    axios
    .get(API)
    .then((res) => {
      const latest = res.data.splice(0, 5);
      let inrValue = 0;
      
      latest.forEach(i => {
          if(i.baseAsset === to) {
            inrValue = Number.parseFloat(value) * i.highPrice
          }
      })

      let config = {
        headers: {
          Authorization: TOKEN,
        }
      }

      axios.post("http://localhost:8000/user/exchange",{
          from : {
              coin: "inr",
              amount:inrValue,
          },
          to: {
              coin: to,
              amount: Number.parseFloat(value)
          }
      }, config).then(res => console.log(res))
      .catch(err => console.log(err))

    })
    .catch((err) => {
      console.log(err);
    });
  };

  const [to, setTo] = React.useState("");
  const [value, setValue] = React.useState("");

  return (
    <div>
      <form onSubmit={exchange}>
      <label>coin</label>
        <select onChange={e => setTo(e.target.value)}>
          {coins.map((coin) => (
            <option value={coin.baseAsset}>{coin.baseAsset}</option>
          ))}
        </select>
        <label>Value</label>
        <input onChange={e => setValue(e.target.value)}></input>
        <button>Sumbit</button>
      </form>
    </div>
  );
}

export default Exchange;
