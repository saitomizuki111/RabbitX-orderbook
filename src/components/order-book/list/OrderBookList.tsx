import { PublicationContext, SubscribedContext } from "centrifuge";
import { useEffect, useState } from "react";
import centrifuge from "../../../services";
import { Orderbook } from "../../../services/types/orderbook.types";
import OrderBookPriceTable from "../price-table";
import { calculateOrderBookAskData } from "../helper/orderBookAskHelper";
import { calculateOrderBookBidData } from "../helper/orderBookBidHelper";

const OrderBookList = () => {
  const [data, setData] = useState<Orderbook>();

  console.log('Orderbooklist=>', data);

  useEffect(() => {
    const subscription = centrifuge.newSubscription("orderbook:BTC-USD");

    subscription.subscribe();

    subscription.on("subscribed", (ctx: SubscribedContext) => {
      setData({
        ...ctx.data,
        asks: calculateOrderBookAskData(ctx.data.asks ?? []),
        bids: calculateOrderBookBidData(ctx.data.bids ?? []),
      });
    });

    subscription.on("publication", (ctx: PublicationContext) => {
      setData(
        (s?: Orderbook) =>
          ({
            ...(s ?? {}),
            asks: calculateOrderBookAskData([
              ...(s?.asks ?? []).filter(
                (t) =>
                  !(ctx.data.asks ?? []).some(
                    (s: Array<string>) => parseFloat(s?.[0]) === parseFloat(t?.[0])
                  )
              ),
              ...(ctx.data.asks ?? []),
            ]),
            bids: calculateOrderBookBidData([
              ...(s?.bids ?? []).filter(
                (t) =>
                  !(ctx.data.bids ?? []).some(
                    (s: Array<string>) => parseFloat(s?.[0]) === parseFloat(t?.[0])
                  )
              ),
              ...(ctx.data.bids ?? []),
            ]),
          } as Orderbook)
      );
    });

    return () => {
      centrifuge.removeSubscription(subscription);
    };
  }, []);

  return (
    <div className="w-full mt-8">
      <OrderBookPriceTable data={(data?.asks ?? []).slice(0, 10)} type="sell" />
      <OrderBookPriceTable data={(data?.bids ?? []).slice(0, 10)} type="buy" />
    </div>
  );
};

export default OrderBookList;
