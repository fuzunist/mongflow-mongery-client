import Row from "@/components/Row";
import Header from "./Header";

import { useMemo, useState } from "react";
import { useUser } from "@/store/hooks/user";

import RawMaterialStocks from "@/pages/RawMaterialStocks";
import RecipeMaterialStocks from "@/pages/RecipeMaterialStocks";
import Stocks from "../Stocks";
import Logs from "./Logs";

const MaterialStocks = () => {
  const [page, setPage] = useState("lastProductStocks");

  return (
    <>
      <Header page={page} setPage={setPage} />
      <Logs page={page} />
    
    </>
  );
};

export default MaterialStocks;
