import Header from './Header'
import { useLastProductStockLogs, useLastProductStocks, useRawMaterialLogs, useRawMaterialStocks, useRecipeMaterialLogs, useRecipeMaterialStocks } from '@/store/hooks/apps'
import { useEffect, useState } from 'react'
import Items from './Items'

const Stocks = ({page}) => {
    const [logs,setLogs]= useState([]) 
    const lastProductLogs=useLastProductStockLogs();
    const rawMaterialLogs=useRawMaterialLogs();
    const recipeMaterialLogs=useRecipeMaterialLogs();

    const lastProductStocks= useLastProductStocks()
    const rawMaterialStocks= useRawMaterialStocks()
    const recipeMaterialStocks= useRecipeMaterialStocks()

     console.log("useLastProductStocks", lastProductStocks)
     console.log("useRawMaterialStocks", rawMaterialStocks)
     console.log("useRecipeMaterialStocks", recipeMaterialStocks)
      console.log("useLastProductLogs", lastProductLogs)

    

    useEffect(() => {
        if (page === "lastProductStocks") {
            setLogs([...lastProductLogs]);
        } else if (page === "rawMaterialStocks") {
            setLogs([...rawMaterialLogs]);
        } else if (page === "recipeMaterialStocks") {
            setLogs([...recipeMaterialLogs]);
        }
    }, [page,lastProductLogs, rawMaterialLogs, recipeMaterialLogs]);

    return (
        <>
            <Header logs={logs} page={page} />
                <Items
                    logs={logs}
                    page={page}
                
                />
               
        </>
    )
}

export default Stocks
