import React from "react";

import styles from "../styles/Dashboard.module.css";
import ETH from "../assets/Ethereum.jpg";

import axios from "axios";

const Dashboard = () => {
  const API = "https://api.wazirx.com/sapi/v1/tickers/24hr";
  const [coins, setCoins] = React.useState([]);
  const [selectedCoin, setSelectedCoin] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        const c = res.data.splice(0, 5)
        setCoins(c)
        setSelectedCoin(c[0])
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.container}>
      <header>
        <h2>CryptoLite</h2>
      </header>
      <main>
        <div className={styles.sidebar}>
          {coins.map((coin) => (
            <CoinTile
              onClick={() => setSelectedCoin(coin)}
              coin={coin}
              selectedSymbol={selectedCoin.symbol}
            />
          ))}
        </div>
        <div className={styles.details}>
          <h2>Ethereum</h2>
          <div className={styles.about}>
            <h3>About</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
              tincidunt arcu tincidunt, volutpat risus vel, eleifend turpis.
              Vivamus elementum risus sed magna volutpat, auctor vehicula elit
              auctor. Nunc sed egestas velit. In vel laoreet quam. Praesent
              maximus diam ac mattis volutpat. Duis ullamcorper ultricies
              gravida. Fusce tempor libero sit amet hendrerit posuere. Maecenas
              diam lacus, interdum vitae magna non, ultrices elementum metus.
              Nulla vehicula ex ac ligula aliquet luctus. Quisque id hendrerit
              eros, quis bibendum magna. Morbi et tortor in urna facilisis
              mollis. Pellentesque ut vestibulum tellus.
            </p>
          </div>
          <div className={styles.numbers}>
            <h3>Value</h3>
            <div>
              <p className={styles.value}>$43125.54</p>
              <p className={styles.change}>
                %20 <span>&uarr;</span>
              </p>
            </div>
            <div>
                <form>
                    <label>Amount</label>
                    <input></input>
                    <label>To</label>
                    <select>
                        {
                            coins.map(coin => <option value={coin.baseAsset}>{coin.baseAsset}</option>)
                        }
                    </select>
                    <button>Buy</button>
                </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const CoinTile = (props) => {
  const classes = [styles.coin_tile];

  if (props.selectedSymbol == props.coin.symbol) classes.push(styles.selected);

  return (
    <div
      className={classes.join(" ")}
      onClick={props.onClick}
      id={props.coin.symbol}
    >
      <img src={ETH} alt="" />
      <div>
        <p>{props.coin.symbol}</p>
        <span>{props.coin.baseAsset}</span>
      </div>
    </div>
  );
};

export default Dashboard;
