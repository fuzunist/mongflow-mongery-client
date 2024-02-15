import Row from '@/components/Row'
import Header from './Header'
import Products from './Products'
import { useLastProductStocks, useRawMaterialStocks, useRecipeMaterialStocks, useStocks } from '@/store/hooks/apps'
import { useEffect, useState } from 'react'
import Selected from './Selected'

const Stocks = ({page}) => {
    const [stocks,setStocks]= useState([]) 
    const lastProductStocks=useLastProductStocks();
    const rawMaterialStocks=useRawMaterialStocks();
    const recipeMaterialStocks=useRecipeMaterialStocks();

    const [selected, setSelected] = useState(null)



    useEffect(()=>{

        switch(page){
            case page==="lastProductStocks":
             setStocks([...lastProductStocks]);
         
             case page==="rawMaterialStocks":
             setStocks([...rawMaterialStocks]);
         
             case page==="recipeMaterialStocks":
             setStocks([...recipeMaterialStocks]);
         }
    }, [page])

    return (
        <>
            <Header stocks={stocks} page={page} />
            <Row align='center'>
                {/* <Products
                    stocks={stocks}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Selected
                    selected={selected}
                    stocks={stocks}
                /> */}
            </Row>
        </>
    )
}

export default Stocks
