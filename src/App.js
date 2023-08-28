import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Select, Table, Form, Button } from "antd";
import "./App.css";

const { Option } = Select;

function App() {
  const [products, setProducts] = useState([
    {
      product: "",
      timestamp: "",
      message: "",
      severity:""
    },
  ]);
  const [productsList, setProductList] = useState([{ product: "" }]);
  const [logs, setLogs] = useState([]);

  const getAllLogs = () => {
    axios
      .get("http://45.55.32.246:3001/api/logs/")
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
      .get("http://45.55.32.246:3001/api/productSearch/")
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

 
  const onFinish = (values) => {
    console.log("Form values:", values);

    const postData = {
      severity: values.severity,
      product: values.product,
    };

    axios
      .post("http://45.55.32.246:3001/api/logsFilter/", postData)
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
      <Form onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item  name="product">
              <Select
                showSearch
                placeholder="Select a product"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {productsList.map((product) => (
                  <Option key={product.product} value={product.product}>
                    {product.product}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item  name="severity">
              <Select placeholder="Select a severity">
                <Option value="all">All</Option>
                <Option value="info">Info</Option>
                <Option value="error">Error</Option>
                <Option value="critical">Critical</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
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
