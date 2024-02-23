import Card from "@/components/Card";
import Row from "@/components/Row";
import { useSearch } from "@/store/hooks/apps";
import { Space, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const WarehouseStocks = ({ stocks }) => {
  const { t } = useTranslation();
  const searchValue = useSearch();

  const filteredStocks = useMemo(() => {
    if (!searchValue) return stocks;

    return stocks.filter(
      (stock) =>
        JSON.stringify(stock.attributedetails)
          ?.toLocaleLowerCase("TR")
          .includes(searchValue.toLocaleLowerCase("TR")) ||
        stock.product_name
          ?.toLocaleLowerCase("TR")
          .includes(searchValue.toLocaleLowerCase("TR")) ||
        stock.customer_name
          ?.toLocaleLowerCase("TR")
          .includes(searchValue.toLocaleLowerCase("TR")) ||
        stock.customer_city
          ?.toLocaleLowerCase("TR")
          .includes(searchValue.toLocaleLowerCase("TR")) ||
        stock.customer_county
          ?.toLocaleLowerCase("TR")
          .includes(searchValue.toLocaleLowerCase("TR"))
    );
  }, [stocks, searchValue]);

  const dataSource = filteredStocks?.map((stock, index) => ({
    warehouse: `${stock.customer_county}/${stock.customer_city}`,
    key: index,
    id: stock?.id,
    product: stock?.product_name,
    customer: stock.companyname,
    attributedetails: stock?.attributedetails,
    price: stock?.price,
    quantity: stock?.quantity,
    currency: [stock.currency_code, stock.exchange_rate, stock.price],
  }));

  const columns = {
    warehouse: [
      {
        title: "Depo",
        dataIndex: "warehouse",
        key: "warehouse",
        className: "text-md font-bold text-gray-700 px-6",
      },
    ],
    warehouseDetails: [
      {
        title: "Ürün",
        dataIndex: "product",
        key: "product",
        className: "text-sm",
      },
      {
        title: "Ürün Detayı",
        dataIndex: "attributedetails",
        key: "attributedetails",
        className: "text-sm ",
        render: (_, record) => {
          return Object.entries(record?.attributedetails).map(
            ([key, value], index) => (
              <div key={index}>
                <span className="font-bold px-2">{key}:</span>
                <span>{value}</span>
              </div>
            )
          );
        },
      },
      {
        title: "Tedarikçi",
        dataIndex: "customer",
        key: "customer",
        className: "text-sm",
      },
      {
        title: "Miktar",
        dataIndex: "quantity",
        key: "quantity",
        className: "text-sm",
        render: (tag) => <span>{tag} ton</span>,
      },

      {
        title: "Birim Fiyat",
        dataIndex: "price",
        key: "price",
        className: "text-sm",
        render: (tag) => <span>{tag} ₺</span>,
      },
      {
        title: "Döviz",
        dataIndex: "currency",
        key: "currency",
        className: "text-sm",

        render: (tags) => (
          <span>
            <Tag
              color={tags[0] === "TL" ? "geekblue" : "green"}
              className="m-1"
            >
              {tags[0] === "TL"
                ? tags[0]?.toLocaleUpperCase("TR")
                : ` ${
                    tags[0]?.toLocaleUpperCase("TR") === "USD"
                      ? "$"
                      : tags[0]?.toLocaleUpperCase("TR")
                  }1= ${tags[1]} ₺`}
            </Tag>
          </span>
        ),
      },
    ],
  };

  return (
    <Row align={"center"} className="mt-8 ">
      <Card variant="overflow">
        <Card.Body>
          <Space split={true} direction="vertical" size={"middle"}>
            <div
              className={`flex w-full border  ${
                searchValue ? " border-blue-300" : ""
              } `}
            >
              <Table
                tableLayout="auto"
                locale={{ emptyText: "Veri Bulunamadı" }}
                showHeader={false}
                pagination={false}
                dataSource={dataSource}
                size={"small"}
                scroll={{ x: 1200 }}
                // className="flex w-full"
                columns={columns.warehouse}
                expandable={{
                  expandedRowRender: (record) => {
                    return (
                    //   <div className="flex w-full justify-center items-center py-2  ">
                      <Table
                        showHeader={true}
                        pagination={false}
                        dataSource={dataSource}
                        locale={{ emptyText: "Veri Bulunamadı" }}
                        // className="flex w-full justify-center items-center"
                        // rowClassName={"flex w-full justify-center items-center"}
                        columns={columns.warehouseDetails}
                      ></Table>
                    //   </div>
                    );
                  },
                  //   rowExpandable: (record) => record.name !== "Not Expandable",
                  expandRowByClick: true,
                  // expandedRowClassName: () => "flex w-full justify-center items-center ",
                }}
              ></Table>
            </div>
          </Space>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default WarehouseStocks;
