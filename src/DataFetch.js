import React from "react";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "./DataFetch.css";

const DataFetch = () => {
  const [currency, setCurrency] = React.useState({});
  const [valuesList, setValuesList] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("https://www.cbr-xml-daily.ru/daily_json.js")
      .then((res) => {
        setCurrency(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  React.useEffect(() => {
    if (currency.Valute) {
      const getValues = Object.entries(currency.Valute).map(([key]) => ({
        name: currency.Valute[key]["Name"],
        numCode: currency.Valute[key]["NumCode"],
        value: currency.Valute[key]["Value"].toFixed(2),
        priceChange: (
          100 -
          (currency.Valute[key]["Value"] / currency.Valute[key]["Previous"]) *
            100
        ).toFixed(2),
      }));
      setValuesList(getValues);
    }
  }, [currency.Valute, setValuesList]);

  return (
    <div>
      <div className="table-header">
        <p className="table-header__value table-header__value_code">
          Currency Code
        </p>
        <p className="table-header__value table-header__value_currency-value">
          Currency Value (RUB)
        </p>
        <p className="table-header__value table-header__value_change">
          24h Change
        </p>
      </div>
      <ul className="currency-list">
        {valuesList.map(({ numCode, value, priceChange, name }) => (
          <li className="currency-container" key={numCode}>
            <Tippy content={name}>
              <div className="currency-table currency-table_numcode">
                {numCode}
              </div>
            </Tippy>
            <Tippy content={name}>
              <div className="currency-table currency-table_value">{value}</div>
            </Tippy>
            {priceChange < 0 ? (
              <p className="currency-percent red">{priceChange} %</p>
            ) : (
              <p className="currency-percent green">{priceChange} %</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DataFetch;
