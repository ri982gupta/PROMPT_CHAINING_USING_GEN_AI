import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Tooltip,
  FileInput,
  InputGroup,
  Icon,
  FormGroup,
  Switch,
} from "@blueprintjs/core";
import { IconNames, Select } from "@blueprintjs/icons";
import axios from "axios";

const GenerativeAI = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const [formData, setFormData] = useState({
    pyspark: false,
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

    console.log(`Field: ${name}, Value: ${value}`);
  };

  const handleSwitchChange = () => {
    setFormData({
      ...formData,
      pyspark: !formData.pyspark,
    });
    
  };

  const handleConnect = async () => {
    const formdata1 = {   "pyspark": "False",

    "db_type":"mysql",

    "db_username":"root",

    "db_password":"my-secret-pw",

    "db_host":"127.0.0.1",

    "db_name":"mlRDMS",

    "table_name":"Churn_Modelling"

}
    console.log(formdata1);
    axios
      .post("http://10.11.52.77:1005/ingestion-pipeline/", formdata1,{
        headers: {
          "Content-Type": "application/json",
          "Access-control-Allow-origin": "*",
          "Access-Control-Allow-Method ": "GET, POST, PUT, DELET ",
          "Access-Control-Allow-Header ": "*",
          Accept: "application/json",
          Authorization: "*",
        },
      })
      .then((response) => {
        console.log(response.data);
      }).catch(function error(error){
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={openDialog}>Click Me</button>

      <Dialog title="Mahesh" isOpen={isOpen} onClose={closeDialog}>
        <DialogBody>
        <label htmlFor="pyspark"> pyspark:</label>
          <Switch
            checked={formData.pyspark}
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
    </div>
  );
};

export default GenerativeAI;

