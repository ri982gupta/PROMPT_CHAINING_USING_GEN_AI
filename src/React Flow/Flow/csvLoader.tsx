import Papa, { ParseResult } from "papaparse";
import { useEffect, useState } from "react";
import "./csvLoader.scss"

type Data = {
  RowNumber: string;
  CustomerId: string;
  Surname: string;
  CreditScore: string;
  Geography: string;
  Gender: string;
  Age: string;
  Tenure: string;
  Balance: string;
  NumOfProducts: string;
  HasCrCard: string;
  IsActiveMember: string;
  EstimatedSalary: string;
  Exited: string;
};

type values = {
  data: Data[];
};

const CsvLoader = () => {
  const [values, setValues] = useState<values | undefined>();
  const [recordsToShow, setRecordsToShow] = useState(10); 

  const getCSV = () => {
    Papa.parse("/Churn_Modelling.csv", {
      header: true,
      download: true,
      skipEmptyLines: true,
      delimiter: ",",
      complete: (results: ParseResult<Data>) => {
        setValues({ data: results.data }); 
      },
    });
  };

  useEffect(() => {
    getCSV();
  }, []);

  const handleRecordsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordsToShow(Number(event.target.value));
  };

  const topRecords = values ? values.data.slice(0, recordsToShow) : [];

  return topRecords.length > 0 ? (
    <div className="custom-table">
      <div>
        Show:
        <select value={recordsToShow} onChange={handleRecordsChange}>
          <option value={10}>10 records</option>
          <option value={20}>20 records</option>
          <option value={50}>50 records</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Row Number</th>
            <th>Customer ID</th>
            <th>Surname</th>
            <th>Credit Score</th>
            <th>Geography</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Tenure</th>
            <th>Balance</th>
            <th>Num of Products</th>
            <th>Has Cr Card</th>
            <th>Is Active Member</th>
            <th>Estimated Salary</th>
            <th>Exited</th>
          </tr>
        </thead>
        <tbody>
          {topRecords.map((row, index) => (
            <tr key={index}>
              <td>{row.RowNumber}</td>
              <td>{row.CustomerId}</td>
              <td>{row.Surname}</td>
              <td>{row.CreditScore}</td>
              <td>{row.Geography}</td>
              <td>{row.Gender}</td>
              <td>{row.Age}</td>
              <td>{row.Tenure}</td>
              <td>{row.Balance}</td>
              <td>{row.NumOfProducts}</td>
              <td>{row.HasCrCard}</td>
              <td>{row.IsActiveMember}</td>
              <td>{row.EstimatedSalary}</td>
              <td>{row.Exited}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div>Loading CSV data...</div>
  );
};

export default CsvLoader;


