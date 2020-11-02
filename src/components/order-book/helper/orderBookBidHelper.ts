export const calculateOrderBookBidData = (
    data: Array<Array<string>>,
    startTotal = 0
  ) => {
    let total = startTotal;
    const calculatedData = data
      .sort((b, a) => parseFloat(a?.[0]) - parseFloat(b?.[0]))
      .filter((item) => {
        const amount = item[1];
        return parseFloat(`${amount}`) > 0;
      })
      .map((item) => {
        const [price, amount] = item;
        total += parseFloat(amount);
        return [price, amount, total];
      });
  
    return calculatedData;
  };
  