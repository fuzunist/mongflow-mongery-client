export function groupStocksByWarehouse(stocks) {
  const warehouseMap = new Map();

  // Iterate through the stocks
  for (const stock of stocks) {
    const {
      attributedetails,
      companyname,
      currency_code,
      customer_city,
      customer_county,
      customer_id,
      exchange_rate,
      id,
      price,
      product_id,
      product_name,
      quantity,
    } = stock;
    const warehouseKey = `${customer_county}/${customer_city}`;

    // Check if the warehouse exists in the map
    if (!warehouseMap.has(warehouseKey)) {
      // If not, create a new entry with an empty array for stocks
      warehouseMap.set(warehouseKey, {
        key: warehouseMap.size +1,
        warehouse: warehouseKey,
        stocks: [],
      });
    }

    // Add the current stock to the warehouse's list of stocks
    warehouseMap.get(warehouseKey).stocks.push({
      id,
      product_id,
      product_name,
      attributedetails,
      companyname,
      currency: [currency_code, exchange_rate, price],
    //   customer_city,
    //   customer_county,
      customer_id,
    //   exchange_rate,
      price,
      quantity,
    });
  }

  // Convert the map values (warehouses) to an array
  const groupedStocks = [...warehouseMap.values()];
  return groupedStocks;
}
