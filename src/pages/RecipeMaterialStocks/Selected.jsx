import Card from "@/components/Card";
import Col from "@/components/Col";
import Modal from "@/components/Modal";
import CreateMaterialStock from "@/modals/CreateMaterialStock";
import { useProducts } from "@/store/hooks/apps";
import {
  dateToIsoFormatWithTimezoneOffset,
  filterOlderThan10Days,
  zipArray,
} from "@/utils/helpers";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRecipeMaterialLogs, useRecipeMaterials } from "@/store/hooks/apps";

const Selected = ({ selected }) => {
  const RecipeMaterialLogs = useRecipeMaterialLogs();
  const recipeMaterialStocks = useRecipeMaterials();

  const { t } = useTranslation();

  const filteredStocks = useMemo(() => {
    if (!RecipeMaterialLogs || !RecipeMaterialLogs.length) return [];
    const filtered = RecipeMaterialLogs?.filter(
      (log) => log.item_id === selected
    );
    const zipped = zipArray(filtered, "date");
    filterOlderThan10Days(zipped, new Date());
    return zipped;
  }, [RecipeMaterialLogs, selected]);

  if (!selected) return null;

  return (
    <Col variant="full">
      <Card>
        <Card.Body>
          <div className="flex flex-col justify-start items-center">
            <h2 className="text-2xl font-semibold text-text-dark-light dark:text-text-dark-dark mb-6">
              {
                recipeMaterialStocks.find((item) => item.id === selected)
                  .material
              }
            </h2>

            <div className="flex flex-col w-full gap-4 min-h-[225px] max-h-[225px] overflow-y-auto scroller">
              {Object.entries(filteredStocks).map(([key, stocks], index) => {
                return (
                  <div
                    className="flex flex-col gap-2 bg-border-light dark:bg-border-dark rounded-md p-4 select-none"
                    key={index}
                  >
                    <div className="flex justify-between items-center">
                      <span>{key}</span>
                      <span>
                        {/* {t("total_stock")}: {stocks[key].quantity} */}
                      </span>
                    </div>
                    <hr className="border-body-fg-dark dark:border-body-fg-light w-full" />
                    <div className="flex flex-col max-h-[160px] gap-2 overflow-y-auto scroller">
                      {stocks.map((stock, _indx) => {
                        return (
                          <Modal
                            key={_indx}
                            text={
                              <>
                                <span>
                                  {t("price")}: {stock.price}{" $"}
                                </span>
                                <span>
                                  {t("quantity")}: {stock.quantity}{" kg"}
                                </span>
                                <span>
                                  {t("totalPrice")}: {stock.quantity*stock.price}{" $"}
                                </span>
                                <span>
                                  {t("supplier")}: {stock.supplier}
                                </span>
                                <span>{t("waybill")}: {stock.waybill}</span>
                              </>
                            }
                            className="flex justify-between items-center p-2 rounded border border-body-fg-dark dark:border-body-fg-light select-none cursor-pointer"
                          >
                            {({ close }) => (
                              <CreateMaterialStock
                                closeModal={close}
                                editing={true}
                                selected={stock}
                              />
                            )}
                          </Modal>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Selected;
