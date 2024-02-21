import React, { Fragment } from "react";

import { Image, Text, View, Page, Document, Font } from "@react-pdf/renderer";
import { styles } from "./styles";
import { createTw } from "react-pdf-tailwind";
import { getAllData, ibans, terms } from "./data";
import { formatDigits } from "@/utils/helpers";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
      fontWeight: "bold",
    },
  ],
  format: "truetype",
});
const tw = createTw({
  theme: {

    extend: {
      colors: {
        custom: "#27a89b",
      },
    },
  },
});
const InvoicePDF = ({ data }) => {
  let coilInfo = null;
  let coilInfo2 = null;

  const dynoData = getAllData(data);

  const InvoiceTitle = () => (
    <View style={tw("flex flex-row mt-6")}>
      <View
        style={tw(
          "flex flex-row flex-1 mx-2 justify-between items-center text-slate-600"
        )}
      >
        <Image
          style={tw("w-[135px]")}
          src={window.location.origin + "/logo-mongery.png"}
        />
        <View>
          <Text style={tw("items-center text-sm font-bold pb-1")}>
            MONGERY YAZILIM İNŞAAT MÜH. METAL SAN. ve TİC. LTD. ŞTİ.
          </Text>
          <Text style={tw("items-start text-xs pb-1")}>
            Vergi Numarası : 6221898454
          </Text>
          <Text style={tw("items-start text-xs pb-1")}>
            Vergi Dairesi : ZİYAPAŞA V.D.
          </Text>
          <Text style={tw("items-start text-xs pb-1")}>
            Eposta : info@mongery.com.tr
          </Text>
          <Text style={tw("items-start text-xs")}>
            İnternet Sitesi : www.mongery.com.tr
          </Text>
        </View>
        <View style={tw("flex flex-col gap-y-2 justify-center items-center")}>
          <Image
            style={tw("w-[44px]")}
            src={window.location.origin + "/tse.png"}
          />
          <Image
            style={tw("w-[44px]")}
            src={window.location.origin + "/kalitest.png"}
          />
          <Text
            style={tw("text-[8px]")}
            render={({ pageNumber, totalPages }) =>
              `Sayfa: ${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </View>
      </View>
    </View>
  );

  const TableTitle = () => (
    <View style={tw("flex justify-center items-center")}>
      <Text style={tw("text-xl mt-4 font-extrabold text-custom")}>
        SATIŞ SÖZLEŞMESİ (PROFORMA FATURA)
      </Text>
    </View>
  );
  const TableHead = () => (
    <View style={tw("flex flex-row text-custom w-full")}>
      <View
        style={tw(
          "flex w-[60%] text-lg font-black pt-2 items-center justify-center border border-custom "
        )}
      >
        <Text>Müşteri Bilgileri</Text>
      </View>
      <View
        style={tw(
          "flex  flex-1 text-lg font-black pt-2 items-center justify-center border-r border-t border-b border-custom"
        )}
      >
        <Text>Sipariş Bilgileri</Text>
      </View>
    </View>
  );

  const TableBody = () => (
    <View style={tw("flex flex-row w-full")}>
      <View style={tw("flex w-[60%] flex-col")}>
        {dynoData.customerInfo.map((receipt) => (
          <View
            key={receipt.id}
            style={[
              tw(
                "flex border-r border-b border-l  border-custom  overflow-hidden text-xs  "
              ),
            ]}
          >
            <Text style={tw("flex flex-wrap px-1 py-1")}>
              {receipt.desc}
              {receipt.value}
            </Text>
          </View>
        ))}
      </View>
      <View style={tw("flex flex-1 flex-col")}>
        {dynoData.orderInfo.map((order) => (
          <View
            key={order.id}
            style={[
              tw(
                "flex grow border-r border-b  border-custom overflow-hidden text-xs " +
                  order.css
              ),
            ]}
          >
            <Text style={tw("flex flex-wrap   px-1 py-1")}>
              {order.desc}: {order.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const TableFooter = () => (
    <View
      style={tw(
        "flex w-full flex-wrap border-r border-r border-b border-l border-custom overflow-hidden"
      )}
    >
      <View style={tw("flex flex-wrap w-full p-1 text-xs")}>
        <Text style={tw("flex text-wrap mb-1")}>
          İş bu sözleşmede yer alan teknik özellikleri ve genel şartları
          inceleyip, tüm sayfaların kaşeli imzalı onayınızı göndermeniz rica
          olunur. İmzasız sayfa olduğu takdirde, bu satış sözleşmesinin ilk
          sayfasının imzalanmasıyla, diğer sayfalardaki maddeler de onaylanmış
          sayılacaktır.
        </Text>
      </View>
    </View>
  );

  const OrdersHeader = () => (
    <View
      style={tw(
        "flex flex-row w-full items-center text-custom font-bold text-sm border-b border-custom pb-1 mt-2 gap-x-1"
      )}
    >
      <Text style={tw("w-[60%] ")}>Mal Tanımı</Text>
      <Text
        style={tw(
          "flex justify-center items-center text-center w-[10%] "
        )}
      >
        Teslimat
      </Text>
      <Text
        style={tw(
          "flex justify-center items-center text-center w-[8%]"
        )}
      >
        Miktar
      </Text>
      <Text
        style={tw(
          "flex justify-center items-center text-center w-[10%]"
        )}
      >
        Birim Fiyat
      </Text>
      <Text
        style={tw(
          "flex justify-center items-center text-center w-[12%]"
        )}
      >
        Toplam Fiyat
      </Text>
    </View>
  );

  const OrderList = () =>
    dynoData.products.map((product, index) => (
      <View key={index} style={tw("flex flex-col w-full")} wrap={false}>
        <Text style={tw("text-sm font-bold")}>{product.name} </Text>
        <Text style={tw("text-sm font-bold text-xs my-1")}>Müşt. Ref/Ürün No</Text>
        <View style={tw("flex flex-row w-full ")}>
          <View
            style={tw("flex flex-row w-[60%] justify-between")}
          >
            <View style={tw("flex flex-col w-[45%]")}>
              <Text style={tw("flex text-xs font-bold items-center mt-1")}>
                Technical Spec/Quality/Material
              </Text>
              <View
                style={tw(
                  "flex flex-row justify-between items-start text-xs mt-2"
                )}
              >
                <View style={"flex flex-col gap-y-2"}>
                  {Object.entries(product.techSpecs).map(([key, value]) => (
                    <Text style={tw("py-1 text-[8px]")}>
                      {key}
                      {" : "}
                    </Text>
                  ))}
                </View>
                <View style={"flex flex-col gap-y-2"}>
                  {Object.entries(product.techSpecs).map(([key, value]) => {
                    return (
                      <Text style={tw("py-1 text-[8px]")}>{value?.value}</Text>
                    );
                  })}
                </View>
              </View>
            </View>
            <View
              style={tw(
                "flex flex-col w-[55%] items-center justify-center text-xs"
              )}
            >
              <Text
                style={tw(
                  "flex text-xs font-bold items-start justify-start mt-1 "
                )}
              >
                Packaging Style
              </Text>

              {/* <View style={tw("flex flex-col justify-center")}> */}
                {/* <View
                  style={tw(
                    "w-full flex text-xs mt-2"
                  )}
                > */}
                  <View style={"w-full flex justify-center text-xs mt-2  gap-y-1 "}>
                    {Object.entries(product.packagingSpecs).map(
                      ([key, value]) => {
                        coilInfo = key === "Açılım" ? value?.value : null;
                        return (
                          <View style={tw("flex flex-row")}>
                            <Text style={tw("py-1 text-[8px]")}>
                              {key}
                              {" : "}
                            </Text>
                            <Text style={tw("py-1 text-[8px]")}>
                              {value?.value}
                            </Text>
                            {/* {coilInfo && <Image
                              style={tw("w-12 h-12")}
                              src={
                                window.location.origin +
                                (coilInfo === "Saat Yönünün Tersi"
                                  ? "/reverseclock.png"
                                  : "/clock.png")
                              }
                            />} */}
                           
                          </View>
                        );
                      }
                    )}
                     {coilInfo && (
                              <View style={tw("flex flex-row ")}>
                              <Text style={tw("py-1 text-[8px]")}>
                                Bobin{" : "}
                              </Text>
                              <Image
                              style={tw("w-12 h-12")}
                              src={
                                window.location.origin +
                                (coilInfo === "Saat Yönünün Tersi"
                                  ? "/reverseclock.png"
                                  : "/clock.png")
                              }
                            />
                            </View>
                            )}
                  {/* </View> */}
                  {/* <View style={"flex flex-col gap-y-2"}>
                    {Object.entries(product.packagingSpecs).map(
                      ([key, value]) => {
                        console.log("packaging 333", key, value);
                        coilInfo2 = key === "Açılım" ? value?.value : null;

                        return (
                          <>
                            <Text style={tw("py-1 text-[8px]")}>
                              {value?.value}
                            </Text>

                            {coilInfo2 && (
                              <Image
                                style={tw("w-12 h-12")}
                                src={
                                  window.location.origin +
                                  (coilInfo === "Saat Yönünün Tersi"
                                    ? "/reverseclock.png"
                                    : "/clock.png")
                                }
                              />
                            )}
                          </>
                        );
                      }
                    )}
                  </View> */}
                {/* </View> */}
              </View>
            </View>
          </View>
          <View
            style={tw(
              "flex flex-wrap w-[10%] items-center justify-center text-xs"
            )}
          >
            <Text
              style={tw(
                "flex flex-row w-full items-center justify-center text-center"
              )}
            >
              {product.delivery_date}
            </Text>
          </View>
          <View
            style={tw(
              "flex flex-wrap w-[6%] items-center justify-center text-xs"
            )}
          >
            <Text
              style={tw(
                "flex flex-row w-full items-center justify-center text-center"
              )}
            >
              {product.quantity} t
            </Text>
          </View>
          <View
            style={tw(
              "flex flex-wrap w-[12%] items-center justify-center text-xs"
            )}
          >
            <Text
              style={tw(
                "flex flex-row w-full items-center justify-center text-center"
              )}
            >
              {formatDigits(product.unitPrice)}
              {dynoData.otherDetails.currency_code}
            </Text>
          </View>
          <View
            style={tw(
              "flex flex-wrap w-[12%] items-center justify-center text-xs"
            )}
          >
            <Text
              style={tw(
                "flex flex-row w-full items-center justify-center text-center"
              )}
            >
              {formatDigits(product.totalPrice)} {dynoData.otherDetails.currency_code}
            </Text>
          </View>
        </View>
        <View
          style={tw("w-full border-b border-dashed border-custom mt-2  mb-4")}
        ></View>
      </View>
    ));

  const PageNumber = () => (
    <View>
      <Text
        style={tw("text-xs")}
        render={({ pageNumber, totalPages }) =>
          `Sayfa: ${pageNumber} / ${totalPages}`
        }
        fixed
      />
    </View>
  );

  const Footer = () => (
    <View style={tw("w-full mt-auto mb-2")} fixed>
      <View style={tw("flex flex-row w-full")}>
        <Text
          style={tw(
            "flex w-[50%] text-sm font-bold pl-1 py-2 border-l border-t border-custom"
          )}
        >
          SATICI
        </Text>
        <Text
          style={tw(
            "flex w-[50%] text-sm font-bold pl-1 py-2 border-l border-t border-r border-custom"
          )}
        >
          ALICI
        </Text>
      </View>
      <View style={tw("flex flex-row w-full justify-start")}>
        <Text
          style={tw(
            "flex w-[50%] text-sm font-bold pl-1 py-1 pb-8 border-l border-t border-b border-custom"
          )}
        >
          Kaşe-İmza
        </Text>
        <Text
          style={tw(
            "flex w-[50%] text-sm font-bold pl-1 py-1 pb-8 border border-custom"
          )}
        >
          Kaşe-İmza
        </Text>
      </View>
      <View
        style={tw("w-full flex-row gap-x-2 mt-2 justify-center items-start")}
      >
        <View style={tw("flex flex-col w-[85%]")}>
          <Text style={tw("font-bold text-sm ml-auto mx-auto")}>Adresler</Text>
          <Text style={tw("flex flex-row w-full items-center")}>
            <Text style={tw("text-xs")}>
              <Text style={tw("text-sm font-bold items-center")}>
                ADANA SATIŞ OFİSİ{"     "}
              </Text>
              : Mahfesığmaz Mah. 79048 SK. No: 4/2 Daire: 3 Çukurova/ADANA
            </Text>
          </Text>
          <View style={tw("flex flex-row w-full overflow-hidden")}>
            <Text style={tw("flex text-xs flex-wrap items-center")}>
              <Text style={tw("text-sm font-bold")}>İSTANBUL SATIŞ OFİSİ</Text>:
              Huzur Mah. Azerbaycan Cd. No:4 Blok:B Skyland Tower Kat:26 No: 375
              Sarıyer/İST
            </Text>
          </View>
        </View>
        <View style={tw("flex flex-col w-[15%] gap-y-1")}>
          <Text style={tw("font-bold text-sm ml-auto mx-auto")}>Telefon</Text>
          <Text style={tw("text-xs")}>{"+90 (536) 960 30 53"}</Text>
          <Text style={tw("text-xs")}>{"+90 (539) 575 15 50"}</Text>
        </View>
        {/* <View style={tw("flex flex-col justify-center items-center")}>
          <Text style={tw("font-bold text-sm ml-auto mx-auto pb-1")}>Faks</Text>
        </View> */}
      </View>
    </View>
  );

  const Seperator = () => (
    <View style={tw("flex w-full my-4 border-b border-custom")}></View>
  );
  const Payment = () => (
    <View wrap={false} style={tw("flex flex-row w-full border border-custom ")}>
      <View style={tw("flex flex-col w-[25%] justify-between text-sm text-custom")}>
        <Text style={tw("flex border-b border-r border-custom px-1 h-5")}>
          Toplam Tutar
        </Text>
        <Text style={tw("flex border-b border-r border-custom px-1 h-5")}>
          Toplam Miktar
        </Text>
        <Text style={tw("flex border-b border-r border-custom px-1 h-5")}>
          Teslimat Şartları
        </Text>
        <Text style={tw("flex border-b border-r border-custom px-1 h-5")}>
          Teslimat Noktası
        </Text>
        <Text style={tw("flex border-r border-custom px-1 h-5")}>
          Ödeme Şekli / Taahhüdü
        </Text>
      </View>
      <View style={tw("flex flex-col w-[75%] justify-between text-sm")}>
        <View
          style={tw(
            "flex flex-row w-full justify-between items-center border-b border-custom  h-5"
          )}
        >
          <Text style={tw("flex border-r border-custom px-1")}>
            {formatDigits(dynoData.paymentInfo.totalPrice)} {" "}{dynoData.otherDetails.currency_code}
          </Text>
          <Text style={tw("flex text-xs font-bold text-custom px-1 ml-auto")}>
            %{dynoData.paymentInfo.taxRate} KDV Dahil Toplam:
          </Text>
          <Text style={tw("flex border-l border-custom px-1")}>
            {formatDigits(dynoData.paymentInfo.totalWithTax)}{" "}{dynoData.otherDetails.currency_code}
          </Text>

          {/* <Text style={tw("flex text-xs px-1")}>
            Bakiye Tarihi: 11/03/2022
          </Text> */}
        </View>
        <View
          style={tw(
            "flex flex-row w-full justify-between items-center border-b border-custom h-5"
          )}
        >
          <Text style={tw("flex px-1")}>
            {" "}
            {dynoData.paymentInfo.totalQuantity}{" ton"}
          </Text>
          {/* <Text style={tw("flex text-xs")}>Bakiye USD = 0.00</Text> */}
          <Text style={tw("flex text-xs font-bold text-custom px-1 ml-auto")}>
          Tevkifat KDV :
          </Text>
          <Text style={tw("flex border-l border-custom px-1")}>
            {formatDigits(dynoData.paymentInfo.vatWitholding)}{" "}{dynoData.otherDetails.currency_code}
          </Text>
        </View>
        <View style={tw("flex flex-row w-full justify-between items-center border-b border-custom h-5")}>
          <Text style={tw("flex h-5 px-1")}>
            {dynoData.paymentInfo.delivery_terms}
          </Text>
          <Text style={tw("flex text-xs font-bold text-custom px-1 ml-auto")}>
            Beyan KDV:
          </Text>
          <Text style={tw("flex border-l border-custom px-1")}>
            {formatDigits(dynoData.paymentInfo.vatDeclaration)}{" "}{dynoData.otherDetails.currency_code}
          </Text>
        </View>
        <View
          style={tw(
            "flex flex-row w-full justify-between items-center border-b border-custom h-5"
          )}
        >
          <Text style={tw("flex px-1")}>
            {dynoData.paymentInfo.delivery_point}
          </Text>
          {/* <Text style={tw("flex text-xs px-1")}>Bakiye TL= 0.00 </Text> */}
        </View>
        <View style={tw("flex flex-row w-full justify-between items-center h-5")}>
          <Text style={tw("flex px-1")}>
            {" "}
            {dynoData.paymentInfo.payment_type}
          </Text>
          <View style={tw("flex flex-row justify-between items-center h-5")}>
            <Text
              style={tw(
                "flex text-sm font-bold text-custom border-r border-l border-custom px-4"
              )}
            >
              Vade
            </Text>
            <Text style={tw("flex px-4")}>
              {" "}
              {dynoData.paymentInfo.maturity}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const SmallTerm = () => (
    <View style={tw("flex w-full text-[6px] justify-end my-2")}>
      <Text style={tw("flex justify-end")}>{terms.sterm}</Text>
    </View>
  );

  const MediumTerm = () => (
    <View
      wrap={false}
      style={tw("flex w-full border border-custom p-1 text-[7px] my-2")}
    >
      <Text style={tw("indent-1")}>{terms.mterm}</Text>
    </View>
  );

  const OtherTerms = () => (
    <View wrap={false} style={tw("flex w-full h-[500px]")}>
      <Text style={tw("text-sm font-bold italic mb-1 text-custom")}>
        DİĞER ŞARTLAR
      </Text>
      <View style={tw("flex flex-col flex-wrap w-full")}>
        <View
          style={tw(
            "flex flex-col text-wrap space-y-2 border-t border-l border-r border-custom"
          )}
        >
          {terms.otherTerms.map((term, index) => (
            <Text
              key={index}
              style={tw(
                "flex flex-wrap grow text-wrap text-[7px] border-b border-custom"
              )}
            >
              {term}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  const BankInfo = () => (
    <View wrap={false} style={tw("flex flex-col w-full my-4")}>
      <Text style={tw("text-sm font-bold italic mb-1 text-custom")}>
        BANKA HESAP BİLGİLERİ
      </Text>

      <View style={tw("flex w-full border border-custom p-2")}>
        {ibans.map((item, index) => (
          <View
            key={index}
            style={tw(
              "flex w-full flex-row py-1 text-xs justify-between items-start"
            )}
          >
            <Text style={tw("font-bold w-[20%]")}>{item.bank}</Text>
            <Text style={tw("font-bold w-[35%]")}>{item.branch}</Text>
            <Text style={tw("font-bold w-[10%]")}>{item.currency}</Text>
            <Text style={tw("font-bold w-[35%]")}>{item.iban}</Text>
          </View>
        ))}
      </View>
    </View>
  );


  const FixedOrderDetail = () => (
    <View
      fixed
      render={({ pageNumber, totalPages }) =>
        pageNumber > 1 && (
          <View
            style={tw(
              "flex flex-row w-full justify-between items-center text-xs mb-4"
            )}
          >
            <Text style={tw("text-xs")}>Siparis No : {data.orderNumber}</Text>
            <Text style={tw("text-xs")}>
              Siparis Tarihi : {dynoData.otherDetails.order_date}
            </Text>
            <Text
              style={tw("text-xs")}
            >{`Sayfa: ${pageNumber} / ${totalPages}`}</Text>
          </View>
        )
      }
    />
  );
  return (
    <Document>
      <Page
        size="A4"
        wrap
        style={[
          styles.font,
          tw("flex flex-col w-full pt-5 pl-10 pb-5 pr-10 leading-6"),
        ]}
      >
        {/* <PageNumber /> */}
        <FixedOrderDetail />
        <InvoiceTitle />
        <TableTitle />
        <TableHead />
        <TableBody />
        <TableFooter />
        <OrdersHeader />
        <OrderList />
        <Seperator />
        <Payment />
        <SmallTerm />
        <MediumTerm />
        <OtherTerms />
        <BankInfo />
        <Footer />
      </Page>
    </Document>
  );
};
export default InvoicePDF;
