import React, { Fragment } from "react";

import { Image, Text, View, Page, Document, Font } from "@react-pdf/renderer";
import { styles } from "./styles";
import { createTw } from "react-pdf-tailwind";
import { getAllData, ibans, reciept_data, terms } from "./data";
import { Flex } from "antd";
// import RobotoRegular from "@/fonts/Roboto-Regular.ttf";
// import RobotoBold from "@/fonts/Roboto-Bold.ttf";

//  console.log("xox ", window.location.origin + "/fonts/Roboto-Regular.ttf")
//   console.log("xox2 ", window.location.origin + "/logo-mongery.png")
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
    //     font:{

    //     }

    extend: {
      colors: {
        custom: "#27a89b",
      },
    },
  },
});
const InvoicePDF = ({data}) => {
 const dynoData= getAllData(data);
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
            Eposta : info@mongery.com.TR
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
              {receipt.desc}{receipt.value}
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
                "flex grow border-r border-b  border-custom overflow-hidden text-xs  "
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
        "flex w-full border-r border-r border-b border-l border-custom overflow-hidden"
      )}
    >
      <View style={tw("flex flex-wrap p-1 text-xs")}>
        <Text>
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
      <Text style={tw("w-[55%]")}>Mal Tanımı</Text>
      <Text style={tw("w-[10%]")}>Teslimat</Text>
      <Text style={tw("w-[6%]")}>Miktar</Text>
      <Text style={tw("w-[12%]")}>Birim Fiyat</Text>
      <Text style={tw("w-[12%]")}>Toplam Fiyat</Text>
    </View>
  );

  const OrderList = () =>
    reciept_data.orders.map((order, index) => (
      <View key={index} style={tw("flex flex-col w-full")} wrap={false}>
        <Text style={tw("text-sm font-bold")}>{order.specs.name} </Text>
        <Text style={tw("text-sm font-bold")}>Müşt. Ref/Ürün No</Text>
        <View style={tw("flex flex-row w-full")}>
          <View style={tw("flex flex-row w-[55%] justify-between  gap-x-4")}>
            <View style={tw("flex flex-col w-[60%]")}>
              <Text style={tw("flex text-sm font-bold items-center mt-1")}>
                Technical Spec/Quality/Material
              </Text>
              <View
                style={tw(
                  "flex flex-row justify-between items-start text-xs mt-2"
                )}
              >
                <View style={"flex flex-col gap-y-2"}>
                  <Text style={tw("py-1")}>Tel Çapı </Text>
                  <Text style={tw("py-1")}>Çap Toleransları </Text>
                  <Text style={tw("py-1 text-[8px]")}>
                    Mukavemet {"(Min-Max)"}
                  </Text>
                  <Text style={tw("py-1")}>Zn Kaplama</Text>
                  <Text style={tw("py-1")}>P. Ağırlık</Text>
                </View>
                <View style={"flex flex-col gap-y-2"}>
                  <Text style={tw("py-1")}>: {order.specs.diameter}</Text>
                  <Text style={tw("py-1")}>
                    : {order.specs.diameterTolerance}
                  </Text>
                  <Text style={tw("py-1")}>: {order.specs.resistance}</Text>
                  <Text style={tw("py-1")}>: {order.specs.znCoating}</Text>
                  <Text style={tw("py-1")}>: {order.specs.weight}</Text>
                </View>
              </View>
            </View>
            <View
              style={tw(
                "flex flex-col w-[25%] items-start justify-left text-xs"
              )}
            >
              <Text
                style={tw(
                  "flex text-sm font-bold items-center justify-left mt-1 "
                )}
              >
                Packaging Style
              </Text>
              <View style={"flex flex-col gap-y-2 text-xs mt-2"}>
                <Text style={tw("py-1")}>{order.packings.coil}</Text>
                <Text style={tw("py-1 text-[6px]")}>
                  {order.packings.inoutDiameter}
                </Text>
                <Text style={tw("py-1")}>{order.packings.material}</Text>
                <Text style={tw("py-1")}>{order.packings.hoop}</Text>
                <Text style={tw("py-1")}>{order.packings.wrap}</Text>
              </View>
            </View>
            <View
              style={tw(
                "flex flex-col w-[15%] items-start justify-left text-xs"
              )}
            >
              <Text>Sarım: {order.coils.coiling}</Text>
              <Image
                style={tw("w-12 h-12")}
                src={window.location.origin + order.coils.img}
              />
              <Text>Açılım: {order.coils.expansion}</Text>
            </View>
          </View>
          <View
            style={tw(
              "flex flex-wrap w-[10%] items-center justify-center text-xs "
            )}
          >
            <Text>{order.delivery}</Text>
          </View>
          <View
            style={tw(
              "flex flex-wrap w-[6%] items-center justify-center text-xs"
            )}
          >
            <Text>{order.quantity}</Text>
          </View>
          <View
            style={tw(
              "flex flex-wrap w-[12%] items-center justify-center text-xs"
            )}
          >
            <Text>{order.unitPrice}</Text>
          </View>
          <View
            style={tw(
              "flex flex-wrap w-[12%] items-center justify-center text-xs"
            )}
          >
            <Text>{order.totalPrice}</Text>
          </View>
        </View>
        <View
          style={tw("w-full border-b border-dashed border-custom mt-2 mb-4")}
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
    <View style={tw("w-full my-4 mb-2")} fixed>
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
            <Text
              style={tw(
                "flex text-xs flex-wrap items-center"
              )}
            >
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
    <View style={tw("flex w-full my-4  border-b border-custom")}></View>
  );
  const Payment = () => (
    <View style={tw("flex flex-row w-full border border-custom")}>
      <View style={tw("flex flex-col w-[25%] gap-y-1 text-sm text-custom")}>
        <Text style={tw("flex border-b border-r border-custom px-1")}>
          Toplam Tutar
        </Text>
        <Text style={tw("flex border-b border-r border-custom px-1")}>
          Toplam Miktar
        </Text>
        <Text style={tw("flex border-b border-r border-custom px-1")}>
          Teslimat Şartları
        </Text>
        <Text style={tw("flex border-b border-r border-custom px-1")}>
          Teslimat Noktası
        </Text>
        <Text style={tw("flex border-r border-custom px-1")}>
          Ödeme Şekli / Taahhüdü
        </Text>
      </View>
      <View style={tw("flex flex-col w-[75%] gap-y-1 text-sm")}>
        <View
          style={tw(
            "flex flex-row w-full justify-between items-center border-b border-custom"
          )}
        >
          <Text style={tw("flex border-r border-custom px-1")}>
            65.110,00 USD
          </Text>
          <Text style={tw("flex text-sm font-bold text-custom px-1")}>
            %18 KDV Dahil Toplam
          </Text>
          <Text style={tw("flex border-r border-l border-custom px-1")}>
            76.829,80 USD
          </Text>

          <Text style={tw("flex text-xs px-1")}>
            Bakiye Tarihi: 11/03/2022
          </Text>
        </View>
        <View
          style={tw(
            "flex flex-row w-full justify-between items-center border-b border-custom"
          )}
        >
          <Text style={tw("flex px-1")}>52,00 Ton</Text>
          <Text style={tw("flex text-xs")}>Bakiye USD = 0.00</Text>
        </View>
        <View style={tw("w-full flex ")}>
          <Text style={tw("flex border-b border-custom px-1")}>
            EXW. Ex Works Fabrika Teslim INCOTERM 2010
          </Text>
        </View>
        <View
          style={tw(
            "flex flex-row w-full justify-between items-center border-b border-custom "
          )}
        >
          <Text style={tw("flex px-1")}>Dilovası</Text>
          <Text style={tw("flex text-xs px-1")}>Bakiye TL= 0.00 </Text>
        </View>
        <View style={tw("flex flex-row w-full justify-between items-center")}>
          <Text style={tw("flex px-1")}>100% Üretim Öncesi</Text>
          <View style={tw("flex flex-row justify-between items-center")}>
            <Text
              style={tw(
                "flex text-sm font-bold text-custom border-r border-l border-custom px-4"
              )}
            >
              Vadesi
            </Text>
            <Text style={tw("flex px-4")}>3 ay</Text>
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
    <View style={tw("flex flex-col flex-wrap w-full")}>
      <Text style={tw("text-sm font-bold italic mb-1 text-custom")}>
        DİĞER ŞARTLAR
      </Text>
      <View
        style={tw(
          "flex flex-col text-wrap space-y-2 border-t border-l border-r border-custom"
        )}
      >
        {terms.otherTerms.map((term, index) => (
       
            <Text style={tw("flex flex-wrap grow text-wrap text-[7px] border-b border-custom")}>
              {term}
            </Text>
        ))}
      </View>
    </View>
  );

  const BankInfo = () => (
    <View wrap={false} style={tw("flex flex-col w-full my-4")}>
      <Text style={tw("text-sm font-bold italic mb-1 text-custom")}>
        BANKA HESAP BİLGİLERİ
      </Text>

      <View style={tw("flex w-full border border-custom p-2")}>
        {ibans.map((item) => (
          <View
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
            
            style={tw("flex flex-row w-full justify-between items-center text-xs pb-1")}
          >
            <Text style={tw("text-xs")}>Siparis No : {data.orderNumber}</Text>
            <Text style={tw("text-xs")}>Siparis Tarihi : 10/02/2023</Text>
            <Text style={tw("text-xs")}>{`Sayfa: ${pageNumber} / ${totalPages}`}</Text>
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
