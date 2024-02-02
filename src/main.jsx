import ReactDOM from "react-dom/client";
import "./assets/css/globals.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { Provider } from "react-redux";
import store from "./store";
import "./i18n";
import "./utils/socket";
import { ConfigProvider } from "antd";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <ConfigProvider
    theme={{
      token: {
        // // Seed Token
        // colorPrimary: '#00b96b',
        // borderRadius: 2,

        // // Alias Token
        // colorBgContainer: '#f6ffed',
     
      },
      components: {
        TimePicker: {
         
        //  presetsWidth:300,
          //  cellWidth:45
        },
      },
    }}
  >
    <RouterProvider router={routes} />
    </ConfigProvider>
  </Provider>
);

sessionStorage.setItem(
  "beforePathname",
  location.pathname === "/" ? "/dashboard" : location.pathname
);

