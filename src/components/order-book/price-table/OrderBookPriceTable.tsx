import { FC, PropsWithChildren } from "react";
import { decimalFormatter } from "../../../utils/number-utils";
import OrderBookPriceTableTotalCell from "./OrderBookPriceTableTotalCell";

const OrderBookPriceTable: FC<
  PropsWithChildren<{ data?: Array<Array<string>>; type?: "buy" | "sell" }>
> = ({ data = [], type = "buy" }) => {
  const formattedData = type === "buy" ? data : data.slice().reverse();

  const maxTotal = formattedData.reduce(
    (ret, cur) => ret + (cur?.[2] ? parseFloat(cur?.[2]) : 0),
    0
  );

  return (
    <div className="w-full mb-4">
      <table className="w-full">
        <thead>
          <tr>
            <th align="left" className="text-gray-500">Price <span className="bg-slate-500 text-gray-400 px-1 text-xs rounded">USD</span></th>
            <th align="right" className="text-gray-500">Amount <span className="bg-slate-500 text-gray-400 px-1 text-xs rounded">BTC</span></th>
            <th align="right" className="text-gray-500">Total <span className="bg-slate-500 text-gray-400 px-1 text-xs rounded">BTC</span></th>
          </tr>
        </thead>
        <tbody>
          {formattedData.map((item, itemIndex) => {
            const [price, amount, total] = item;

            return (
              <tr key={itemIndex} className="hover:bg-slate-500 cursor-pointer">
                <td
                  align="left"
                  className={type === "buy" ? "text-green-500" : "text-red-500"}
                >
                  {decimalFormatter(price, 0)}
                </td>
                <td align="right">{decimalFormatter(amount)}</td>
                <td align="right">
                  <OrderBookPriceTableTotalCell
                    total={maxTotal}
                    value={parseFloat(total)}
                    color={type === "buy" ? "green" : "red"}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBookPriceTable;
