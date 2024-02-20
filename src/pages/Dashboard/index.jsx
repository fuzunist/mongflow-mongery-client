import Row from "@/components/Row";
import Col from "@/components/Col";
import Orders from "./Orders";
import StockChart from "./StockChart";
import { useTranslation } from "react-i18next";
import { useProductions, useStocks } from "@/store/hooks/apps";
import ProductionChart from "./ProductionChart";
import SalesChart from "./SalesChart";
import RecipeStockChart from "./RecipeStockChart";
import LastProductStockChart from "./LastProductStockChart";
import RawStockChart from "./RawStockChart";
import ExpensesChart from "./ExpensesChart";
import IncomeExpenseChart from "./IncomeExpenseChart";
import OrderStatusChart from "./OrderStatusChart";
import TargetSales from "./TargetSales";
import CompanyOrderChart from "./CompanyOrderChart";
import CostPerOrderChart from "./CostPerOrderChart";
import Warnings from "./Warnings";
import { useUser } from "@/store/hooks/user";

const Dasboard = () => {
  const { t } = useTranslation();
  const stocks = useStocks();
  const productions = useProductions();
  const user = useUser();

  return (
    <Row>
      {/* <Warnings /> */}
      {user.usertype === "boss" && <Orders />}

<LastProductStockChart />
      <RecipeStockChart />
      <RawStockChart />
      <SalesChart />
      <ExpensesChart />
      <IncomeExpenseChart /> 
      <OrderStatusChart />
      <ProductionChart
        title={t("productions")}
        productions={productions}
        t={t}
      />
      <CompanyOrderChart />
      <TargetSales /> 
      <CostPerOrderChart />
     
    </Row>
  );
};

export default Dasboard;
