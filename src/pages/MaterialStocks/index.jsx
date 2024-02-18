import Header from "./Header";
import {useState } from "react";
import Log from "./Logs/Log";

const MaterialStocks = () => {
  const [page, setPage] = useState("lastProductStocks");
  return (
    <>
      <Header page={page} setPage={setPage} />
      <Log page={page} />
    </>
  );
};

export default MaterialStocks;
