import Header from "./Header";

import { useMemo, useState } from "react";

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
