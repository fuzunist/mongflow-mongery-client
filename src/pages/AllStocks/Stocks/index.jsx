import Header from './Header'
import { useLastProductStockLogs, useLastProductStockWarehouse, useLastProductStocks, useRawMaterialLogs, useRawMaterialStocks, useRecipeMaterialLogs, useRecipeMaterialStocks } from '@/store/hooks/apps'
import { useEffect, useState } from 'react'
import Items from './Items'
import WarehouseStocks from './WarehouseStocks'

const Stocks = ({page}) => {
    const [stocks,setStocks]= useState([]) 
    const lastProductLogs=useLastProductStockLogs();
    const rawMaterialLogs=useRawMaterialLogs();
    const recipeMaterialLogs=useRecipeMaterialLogs();

    const lastProductStocks= useLastProductStocks()
    const rawMaterialStocks= useRawMaterialStocks()
    const recipeMaterialStocks= useRecipeMaterialStocks()
    const lastProductStockWarehouses= useLastProductStockWarehouse()

     console.log("useLastProductStocks", lastProductStocks)
     console.log("useRawMaterialStocks", rawMaterialStocks)
     console.log("useRecipeMaterialStocks", recipeMaterialStocks)
      console.log("uselastProductStockWarehouses", lastProductStockWarehouses)

    

    useEffect(() => {
        if (page === "lastProductStocks") {
            setStocks([...lastProductStocks]);
        } else if (page === "rawMaterialStocks") {
            setStocks([...rawMaterialStocks]);
        } else if (page === "recipeMaterialStocks") {
            setStocks([...recipeMaterialStocks]);
        } else if (page === "warehouseStocks") {
            setStocks([...lastProductStockWarehouses]);
        }
    }, [page, lastProductStocks, rawMaterialStocks, recipeMaterialStocks, lastProductStockWarehouses]);

    return (
        <>
            <Header page={page} />
            {
                page==="warehouseStocks" ? 
                <WarehouseStocks stocks={stocks} /> : 
                <Items
                stocks={stocks}
                page={page}
            />
            }
                
               
        </>
    )
}

export default Stocks
