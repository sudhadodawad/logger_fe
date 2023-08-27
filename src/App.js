import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Select, Table } from "antd";
import "./App.css";

const { Option } = Select;

function App() {
  const [products, setProducts] = useState([
    {
      product: "new product2",
      timestamp: "2023-08-02T00:00:00.000Z",
      message: "this is new log",
    },
  ]);
  const [productsList, setProductList] = useState([{ product: "" }]);
  const [logs, setLogs] = useState([]);

  const getAllLogs = () => {
    axios
      .get("http://142.93.126.22:3001/api/logs/")
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };
  const getAllProducts = () => {
    axios
      .get("http://142.93.126.22:3001/api/productSearch/")
      .then((response) => {
        console.log(response.data);
        setProductList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  useEffect(() => {
    getAllLogs();
    getAllProducts();
  }, []);

  const onChange = (value) => {
    console.log(`selected ${value}`);
    axios
      .get("http://142.93.126.22:3001/api/logsFilter/", {
        params: { severity: value },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };
  const onSearch = (value) => {
    console.log(`selected ${value}`);
    axios
      .get("http://142.93.126.22:3001/api/productFilter/", {
        params: { product: value },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const columns = [
    {
      title: "Severity",
      dataIndex: "logLevel",
      key: "logLevel",
      render: (text) => {
        if (text === "error") {
          return <div style={{ color: "yellow" }}>{text}</div>;
        } else if (text === "critical") {
          return <div style={{ color: "red" }}>{text}</div>;
        } else {
          return text; // Return the severity text as-is for other cases
        }
      },
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      // date format "DD-MM-YYYY HH:mm:ss"
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleString();
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
  ];

  

  return (
    <div className="App">
      <h1>Centralized Logging System</h1>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Search by product name"
        optionFilterProp="children"
        onChange={onSearch} // Handle search input
      >
        {productsList.map((product) => (
          // Disticnt product names

          <Option key={product.product} value={product.product}>
            {product.product}
          </Option>
        ))}
      </Select>
      <Select placeholder="Select a severity" onChange={onChange}>
        <Option value="all">All</Option>
        <Option value="info">Info</Option>
        <Option value="error">Error</Option>
        <Option value="critical">Critical</Option>
      </Select>
      <Row align={"center"}>
        <Table
          columns={columns}
          dataSource={products}
          //table height and width, padding
          style={{ width: 1000 }}
          scroll={{ y: 340 }}
        />
      </Row>
    </div>
  );
}

export default App;
