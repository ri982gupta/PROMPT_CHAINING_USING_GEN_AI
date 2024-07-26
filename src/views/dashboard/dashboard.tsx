import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import LinearProgress from '@mui/material/LinearProgress';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface FileData {
  filename: string;
  progress?: number;
  // Add other properties as needed
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const user: string[] | null = JSON.parse(sessionStorage.getItem('userData'));
    console.log('dashoard=>user:', user && user[1]);
    setName(user && user[1]);
    fetchFilesFromFolder(user && user[1]);
  }, [location.state]);

  const fetchFilesFromFolder = async (name: string | undefined) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
      });

      const data: FileData[] = await response.json();
      console.log(data);
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleSubmitForText = (file: FileData | null) => {
    if (file !== null) {
      const data = { 'name': name, 'file': file };
      navigate("/pdf_text", { state: { pdfFile: data } });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No PDF selected",
      });
    }
  };

  const filesSelectPage = () => {
    console.log(name);
    navigate('/upload-document', { state: { name: name } });
  };

  const calculatePercentageFilled = (file: FileData) => {
    return file.progress || 70;
  };

  return (
    <div>
      <div className='dcontainer'>
        <h3>Files</h3>
        <div className="h-buttons">
          <button className='btn btn-success' onClick={() => filesSelectPage()}>
            Select Files
          </button>
        </div>
      </div>

      <TextField
        sx={{ width: "300px", float: "right", marginRight: "20px", padding: "0", borderRadius: "3px" }}
        margin="normal"
        placeholder="Search"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2} style={{ marginLeft: '20px' }}>
        {files.map((file, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: '190px', display: 'flex', flexDirection: 'column', width: '450px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', marginTop: '15px' }}
              onClick={() => handleSubmitForText(file)}
            >

              <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: '14px' }}>Detected words: 120</Typography>
                  <Typography sx={{ fontSize: '14px' }}>Redacted words: 100</Typography>
                  <Typography sx={{ fontSize: '14px' }}>Last redaction date:</Typography>
                </div>
                <InsertDriveFileIcon sx={{ fontSize: 60 }} />
              </CardContent>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', flexDirection: 'row', marginTop: '50px' }}>
                <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 'bold', marginTop: 'auto' }}>{file.filename}</Typography>
                <progress
                  value={calculatePercentageFilled(file)}
                  max="100"
                  style={{ width: '150px', height: '20px', marginTop: '5px', marginLeft: '30px' }}
                ></progress>
                <Typography variant="caption" sx={{ fontSize: '10px', marginTop: '5px', marginLeft: '5px' }}>
                  {calculatePercentageFilled(file)}%
                </Typography>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div >
  );
};

export default Dashboard;
