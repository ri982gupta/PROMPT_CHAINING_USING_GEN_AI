import React, { ChangeEvent, useEffect, useState } from "react";
import { useCallback } from "react";
import "./AutoML.scss";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
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
  Button,
  Tooltip,
  FileInput,
  InputGroup,
  Icon,
  Switch,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

interface CurrentConnection {
  source: string;
  target: string;
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "Kafka",
    data: { label: "Kafka" },
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
    id: "5",

    data: { label: " Data PREPROCESSING/FEATURE ENGINEERING " },
    position: { x: 250, y: 200 },
  },
  {
    id: "6",

    data: { label: "FEATURE SELECTION" },
    position: { x: 450, y: 200 },
  },
  {
    id: "7",
 
    data: { label: "MODEL TRAINING" },
    position: { x: 450, y: 100 },
  },
  {
    id: "8",
    data: { label: "MODEL VALIDATION " },
    position: { x: 900, y: 200 },
  },
  {
    id: "9",
    data: { label: "MODEL DASHBOARD" },
    position: { x: 450, y: 20 },
  },
  {
    id: "10",
    data: { label: "VISULAIZE/STORE RESULTS" },
    position: { x: 700, y: 200 },
  },

  {
    id: "11",
    data: { label: "MODEL DEPLOYEMENT" },
    position: { x: 900, y: 100 },
  },
  {
    id: "12",
    data: { label: "MODEL MONITORING" },
    position: { x: 900, y: 300 },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  database: Input,
  File: Output,
  Kafka: Kafka,
  target: Handler,
};

const Custom = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<
    Edge | Connection
  >();



  const [formData, setFormData] = useState({
    pyspark: "False",
    db_type: "",
    db_username: "",
    db_password: "",
    db_host: "",
    db_name: "",
    table_name: "",
  });
const handleInputChange = (e: any) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });

}
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (typeof params !== "boolean") {
        console.log("true");
        setEdges((els) => addEdge(params, els));
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
      currentConnection.target === "5"
    ) {
      setIsOpen2(true);
    } else if (
      currentConnection.source === "3" &&
      currentConnection.target === "4"
    ) {
      setIsOpen3(true);
    } else setIsOpen(true);
  }, [currentConnection]);

  const [active, setActive] = React.useState(false);

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
          <Switch
            labelElement={"Pyspark"}
            innerLabelChecked="on"
            innerLabel="off"
          />
         <label htmlFor="databaseType">db_type:</label>
          <select
              id="databaseType"
              name="db_type"
              value={formData.db_type}
              onChange={handleInputChange}
          >
            <option value="1">mysql</option>
            <option value="2">PostgreSQL</option>
            <option value="3">MongoDB</option>
            <option value="4">SQLite</option>
          </select>
          <p>db_type:</p>
          <InputGroup type="Database" name="name" placeholder=" " />
          <p>Database:</p>
          <InputGroup type="Database" name="name" placeholder=" " />
          {/* <p>Username:</p> */}
          <label>
            {" "}
            <Icon icon={IconNames.User}></Icon> UserName
          </label>
          <InputGroup type="text" name="name" placeholder=" " />
          <label>
            {" "}
            <Icon icon={IconNames.Key}></Icon> UserName
          </label>
          <InputGroup type="Password" name="name" placeholder=" " />
        </DialogBody>
        <DialogFooter>
          <button type="button">Connect</button>
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
          <p>Upload a File</p>
          <FileInput buttonText="Choose File" />
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        
      >
       
        <Controls />
      
      </ReactFlow>
    </div>
  );
};

export default Custom;
