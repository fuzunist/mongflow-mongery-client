import Row from "@/components/Row";
import Header from "./Header";

import { useMemo, useState } from "react";
import { useUser } from "@/store/hooks/user";

import RawMaterialStocks from "@/pages/RawMaterialStocks";
import RecipeMaterialStocks from "@/pages/RecipeMaterialStocks";
import Stocks from "../Stocks";

const MaterialStocks = () => {
  const [page, setPage] = useState("rawMaterialStocks");

  return (
    <>
      <Header page={page} setPage={setPage} />
      <Row>
        <div className="flex flex-col w-full">
          <Stocks page={page} />
        </div>
      </Row>
    </>
  );
};

export default MaterialStocks;
