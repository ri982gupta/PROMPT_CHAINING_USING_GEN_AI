import React, { ChangeEvent, useEffect, useState } from "react";
import { useCallback } from "react";
import "./AutoML.scss";
// import Papa from "papaparse";
import CsvLoader from "./Flow/csvLoader";
import ReactFlow, {
  Node,
  addEdge,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  Position,
  MiniMap,
  Controls,
  Handle,
} from "reactflow";

import Input from "./Flow/Input";
import Kafka from "./Flow/Kafka";
import Output from "./Flow/Output";
import Handler from "./Flow/Handler";
import "reactflow/dist/style.css";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  FileInput,
  InputGroup,
  Icon,
  Switch,
  Button,
  Card,
} from "@blueprintjs/core";

import axios from "axios";

const defaultNodeStyle = {
  border: "2px solid black",
  background: "white",
  borderRadius: 20,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "Kafka",
    data: { label: "KAFKA" },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "database",
    data: { label: "Database" },
    position: { x: 100, y: 200 },
  },
  {
    id: "3",
    type: "File",
    data: { label: "File" },
    position: { x: 100, y: 300 },
  },

  {
    id: "4",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: "Auto ML" },
    position: { x: 300, y: 200 },
    style: defaultNodeStyle,
  },

  {
    id: "6",
    targetPosition: Position.Bottom,
    data: { label: "Model Dashboard" },
    position: { x: 500, y: 50 },
    style: defaultNodeStyle,
  },
  {
    id: "7",
    targetPosition: Position.Top,
    data: { label: "Visualize/Store results" },
    position: { x: 500, y: 300 },
    style: defaultNodeStyle,
  },
  {
    id: "8",
    data: { label: "Model Deployment " },
    position: { x: 700, y: 50 },
    style: defaultNodeStyle,
  },
  {
    id: "9",
    data: { label: "Model Monitoring" },
    position: { x: 900, y: 300 },

    style: defaultNodeStyle,
  },
];

const initialEdges: Edge[] = [];
const nodeTypes = {
  database: Input,
  File: Output,
  Kafka: Kafka,
  target: Handler,
};

const AutoML = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  
  const [currentConnection, setCurrentConnection] = useState<
    Edge | Connection
  >();
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (typeof params !== "boolean") {
        console.log(params);
        setEdges((els:any) => addEdge(params, els));
        setCurrentConnection(params);
      }
    },
    [setEdges]
  );

  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (currentConnection == undefined) {
      return;
    }
    if (currentConnection.source === "1" && currentConnection.target === "4") {
      setIsOpen1(true);
    } else if (
      currentConnection.source === "2" &&
      currentConnection.target === "4"
    ) {
      setIsOpen2(true);
    } else if (
      currentConnection.source === "3" &&
      currentConnection.target === "4"
    ) {
      setIsOpen3(true);
    } else if (
      currentConnection.source === "4" &&
      currentConnection.target === "6"
    ) {
      setIsOpen4(true);
    } else if (
      currentConnection.source === "4" &&
      currentConnection.target === "7"
    ) {
      setIsOpen5(true);
    } else setIsOpen(true);
  }, [currentConnection]);

  const [formData, setFormData] = useState({
    pyspark: "False",
    db_type: "mysql",
    db_username: "",
    db_password: "",
    db_host: "",
    db_name: "",
    table_name: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConnect = async () => {
    const formData1 = {
      pyspark: formData.pyspark,
      db_type: formData.db_type,
      db_username: formData.db_username,
      db_password: formData.db_password,
      db_host: formData.db_host,
      db_name: formData.db_name,
      table_name: formData.table_name,
    };
    console.log(formData1);

    try {
      const response = await axios.post(
        "http://10.11.52.77:1005/ingestion-pipeline/",
        formData1,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-control-Allow-origin": "*",
            "Access-Control-Allow-Method ": "GET, POST, PUT, DELET ",
            "Access-Control-Allow-Header ": "*",
            Accept: "application/json",
            Authorization: "*",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedFile, setSelectedFile] = useState<any>();
  const [pyspark, setPySpark] = useState(false);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSwitchChange = () => {
    setPySpark(!pyspark);
  };

  const handleFileUpload = async () => {
    console.log("hello entered");
    console.log(selectedFile);
    if (selectedFile === null) {
      console.error("No file selected.");

      return;
    }

    const formData = new FormData();
    const formdata = {
      csv: selectedFile,
      pyspark: "False",
    };
    console.log(formdata);
    formData.append("csv", selectedFile);
    formData.append("pyspark", "False");
    try {
      const response = await axios.post(
        "http://10.11.52.77:1005/ingestion-pipeline/",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-control-Allow-origin": "*",
            "Access-Control-Allow-Method ": "GET, POST, PUT, DELET ",
            "Access-Control-Allow-Header ": "*",
            Accept: "application/json",
            Authorization: "*",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitHandler = (event: any) => {
    event.preventDefault();
  };

  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const [active, setActive] = React.useState(false);
  const onEdgeClick = () => {
    setIsOpen1(true);
    setIsOpen2(true);
    setIsOpen1(true);
  };

  const url = "http://10.11.52.77:5000/";

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Dialog
        title="Informational dialog"
        isOpen={isOpen}
        onClose={closePopup}
        style={{ width: "1000px" }}
      >
        <DialogBody>
          <button type="button">asdfasdf</button>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>

      <Dialog
        icon="label"
        title="Kafka"
        isOpen={isOpen1}
        onClose={() => {
          setIsOpen1(false);
        }}
        style={{ width: "1000px" }}
      >
        <DialogBody>
          <p>UserName:</p>
          <InputGroup type="text" name="name" placeholder=" " />
          <p>Password:</p>
          <InputGroup type="Password" name="name" placeholder=" " />
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
      <Dialog
        icon="database"
        title="Database"
        isOpen={isOpen2}
        onClose={() => {
          setIsOpen2(false);
        }}
        style={{ width: "1000px" }}
      >
        <DialogBody>
          <label htmlFor="pyspark"> pyspark:</label>
          <Switch
            onChange={handleSwitchChange}
            labelElement={<strong>Enable</strong>}
          />

          <label htmlFor="databaseType">db_type:</label>
          <select
            id="databaseType"
            name="databaseType"
            value={formData.db_type}
            onChange={handleInputChange}
          >
            <option value="mysql">mysql</option>
            <option value="2">PostgreSQL</option>
            <option value="3">MongoDB</option>
            <option value="4">SQLite</option>
          </select>

          <p>db_username:</p>
          <InputGroup
            type="text"
            name="db_username"
            placeholder=""
            value={formData.db_username}
            onChange={handleInputChange}
          />

          <p>db_password:</p>
          <InputGroup
            type="password"
            name="db_password"
            placeholder=""
            value={formData.db_password}
            onChange={handleInputChange}
          />

          <p>db_host:</p>
          <InputGroup
            type="text"
            name="db_host"
            placeholder=""
            value={formData.db_host}
            onChange={handleInputChange}
          />

          <p>db_name:</p>
          <InputGroup
            type="text"
            name="db_name"
            placeholder=""
            value={formData.db_name}
            onChange={handleInputChange}
          />

          <p>table_name:</p>
          <InputGroup
            type="text"
            name="table_name"
            placeholder=""
            value={formData.table_name}
            onChange={handleInputChange}
          />
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleConnect}>Connect</Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        icon="document"
        title="Flatfile"
        isOpen={isOpen3}
        onClose={() => {
          setIsOpen3(false);
        }}
        style={{ width: "1000px" }}
      >
        <DialogBody>
          <label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              accept=".csv"
            />
          </label>
          <label htmlFor="pyspark"></label>
          <Switch
            checked={pyspark}
            onChange={handleSwitchChange}
            labelElement={<strong>Enable</strong>}
          />
        </DialogBody>
        <DialogFooter>
          <button onClick={handleFileUpload}>Upload</button>
        </DialogFooter>
      </Dialog>
      <Dialog
        title="MLFlow"
        isOpen={isOpen4}
        onClose={() => {
          setIsOpen4(false);
        }}
        style={{ width: "1000px", height: "80vh" }}
      >
        <DialogBody>
          <iframe
            src={url}
            width="100%"
            height="800vh"
            style={{ width: " 100vh", marginTop: "-75px" }}
          />
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
      <Dialog
        title="Records"
        isOpen={isOpen5}
        onClose={() => {
          setIsOpen5(false);
        }}
        style={{ width: "100vh", height: "80vh" }}
      >
        <DialogBody>
        <CsvLoader />
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>

      <Card style={{height:'320px', width: '100%', display:"flex"}}>
      <div style={{height:'250px',width:'100%'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onEdgeClick={onEdgeClick}
        fitView
      >
        <Controls />
      </ReactFlow>
      </div>
      </Card>
    </div>
  );
};

export default AutoML;
