import React, { useState, useEffect, useRef } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { Navigate, useLocation } from 'react-router-dom';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { RenderHighlightsProps, searchPlugin } from '@react-pdf-viewer/search';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './pdf_text.scss';
import { useNavigate } from 'react-router-dom';
import { IconNames } from "@blueprintjs/icons";
import { Button, Icon, Intent } from "@blueprintjs/core";

interface ApiResponse {
  [key: string]: {
    person: string[];
    address: string[];
    org: string[];
    email: string[];
    phoneNumber: string[];
  };
}

const Pdf_text: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfView, setPdfView] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(2);
  const [apiResponse, setApiResponse] = useState<ApiResponse>({});
  const [dataSelected, setDataSelected] = useState<ApiResponse>({
    "person": [],
    "address": [],
    "org": [],
    "email": [],
    "phoneNumber": []
  });
  const [displayData, setDisplayData] = useState<ApiResponse | null>(null);
  const [setSelection, setSetSelection] = useState<Selection | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [optionsDisplay, setOptionsDisplay] = useState<boolean>(false);
  const [tableDisplay, setTableDisplay] = useState<boolean>(false);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [showReject, setShowReject] = useState<boolean>(true);

  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const pdfData = location.state?.pdfFile;
    if (pdfData) {
      console.log(pdfData)
      const data = "data:application/pdf;base64,"

      const file = data + pdfData.file.content_base64
      const name = pdfData.name + '/' + pdfData.file.filename
      setPdfFile(file);
      setPdfView(file);
      setPdfName(name);
      handleSubmit(name, file);
    }

  }, [location.state]);

  const handleSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    setSelectedText(text);
    setSetSelection(selection);


    if (selection && selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      var span = document.createElement('span');
      span.style.backgroundColor = '';
      range.surroundContents(span);
    }


    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setContextMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX + rect.width / 2,
      });

      setContextMenuVisible(true);
    } else {
      setContextMenuVisible(false);
      setOptionsDisplay(false);
    }
  };


  const handleContextMenuChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedOption = e.currentTarget.value;
    // Handle the selected option as needed
    var selection = window.getSelection();
    const colors = { "person": "#ff0000", "address": "#00ff00", "org": "#0000ff", "email": "#e97407", "phoneNumber": "#ff00b3" };
    console.log('Selected Option:', selectedOption);
    console.log('selected text:', selectedText);
    apiResponse[currentPage][selectedOption].push(selectedText);
    setDataSelected(prevData => ({
      ...prevData,
      [selectedOption]: [...prevData[selectedOption], selectedText]
    }));
    console.log(apiResponse[currentPage]);
    console.log(dataSelected);

    if (selection && selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      console.log(range);
      var span = document.createElement('span');
      span.style.backgroundColor = colors[selectedOption];
      range.surroundContents(span);
    }

    setContextMenuVisible(false);
    setOptionsDisplay(false);
    setShowReject(true);
  };

  const handlePageChange = (e: { currentPage: number }) => {
    localStorage.setItem('current-page', `${e.currentPage}`);
    let k = e.currentPage + 1;
    setCurrentPage(k);

    if (apiResponse[k]) {
      setDisplayData(apiResponse[k]);
    } else {
      setDisplayData(null);
    }
  };

  const handleSubmit = async (name: string, file: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(name),
      });
      const data1 = await response.json();
      console.log(data1);
      setApiResponse(data1.data);
      setTableDisplay(true);
    } catch (error) {
      console.error('Error calling API:', error);
    } finally {
      console.log("success");
    }
  };

  const handleRedaction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/file_redact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ json: apiResponse, name: pdfName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Redaction successful:', result);
      const data = "data:application/pdf;base64,"

      const file = data + result.file[0].content_base64
      console.log(file);
      setPdfView(file);
      setTableDisplay(false);

    } catch (error) {
      console.error('Error during redaction:', error);
    }
  };

  const handleReject = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Success");
    setOptionsDisplay(false);
    var selection = window.getSelection();
    const text = selection?.toString().trim();

    const labels = { "#ff0000": "person", "#00ff00": "address", "#0000ff": "org", "#e97407": "email", "#ff00b3": "phoneNumber" };

    if (selection && selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      var span = document.createElement('span');

      const parentSpan = getParentSpanWithColor(range.commonAncestorContainer);

      if (parentSpan) {
        const existingColor = parentSpan.style.backgroundColor;
        const hexColor = rgbToHex(existingColor);
        console.log("Existing Color (Hex):", hexColor);
        var label = labels[hexColor];

        var i1 = apiResponse[currentPage][label].findIndex(person => person.trim().toLowerCase() === text?.trim().toLowerCase());
        var i2 = dataSelected[label].findIndex(person => person.trim().toLowerCase() === text?.trim().toLowerCase());
        console.log(i1, i2);
        console.log(text);
        console.log(label);

        console.log(apiResponse[currentPage][label]);
        console.log(dataSelected[label]);

        apiResponse[currentPage][label].splice(i1, 1);
        dataSelected[label].splice(i2, 1);

        span.style.backgroundColor = '#ffffff';
        range.surroundContents(span);

      } else {
        setApiResponse((prevApiResponse) => {
          const newApiResponse = { ...prevApiResponse };
          console.log("api Response")
          console.log(apiResponse)
          for (const key in apiResponse) {
            if (apiResponse.hasOwnProperty(key)) {
              const entry = apiResponse[key];
              for (const i in entry) {
                if (Array.isArray(entry[i])) {
                  entry[i] = entry[i].filter(item => item !== text);
                }
              }
            }
          }
          return newApiResponse;
        });
      }
    }
    setContextMenuVisible(false);
  };

  const getParentSpanWithColor = (node: Node | null) => {
    while (node && node !== document.body) {
      if (node.nodeName === 'SPAN' && (node as HTMLElement).style.backgroundColor) {
        return node as HTMLElement;
      }
      node = node.parentNode;
    }
    return null;
  };

  const getRGBColorFromBorderStyle = (borderStyle: string) => {
    const match = borderStyle.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (match) {
      return `rgb(${match[1]}, ${match[2]}, ${match[3]})`;
    }
    return null;
  };

  const rgbToHex = (rgb: string) => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
      return rgb;
    }

    const hex = (x: string) => ("0" + parseInt(x).toString(16)).slice(-2);
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
  };

  const handleAccept = () => {
    console.log(contextMenuPosition);

    if (!optionsDisplay) {
      setOptionsDisplay(true);
    }
    else {
      setOptionsDisplay(false);
    }
  }

  // Highlighting Keywords
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Convert Object to Array
  const getObjectValues = (obj: any): string[] =>
    obj && typeof obj === 'object'
      ? Object.values(obj).map(getObjectValues).flat()
      : [obj];

  const [wordsToHighlight, setWordsToHighlight] = useState<string[]>([""]);

  const colors = {
    person: "#ff0000",
    address: "#00ff00",
    org: "#0000ff",
    email: "#e97407",
    phoneNumber: "#ff00b3",
  };

  const keywordSpecificColor = (idx: string) => {
    for (const [key, innerObject] of Object.entries(apiResponse)) {
      for (const [property, values] of Object.entries(innerObject)) {
        if (values.includes(idx)) {
          const colorKey = Object.keys(colors).find(cKey => cKey === property);
          if (colorKey) {
            const color = colors[colorKey];
            console.log(`Color for ${property}, key: ${key} corresponding to value ${idx} is: ${color}`);
            return color;
          }
        }
      }
    }
    return 'defaultColor';
  }

  useEffect(() => {
    setWordsToHighlight(getObjectValues(apiResponse));
  }, [apiResponse]);

  const renderHighlights = (renderProps: RenderHighlightsProps) => {
    return (
      <>
        {renderProps.highlightAreas.map((area, idx) => (
          <div
            key={`${area.pageIndex}-${idx}`}
            style={{
              ...renderProps.getCssProperties(area),
              position: 'absolute',
              backgroundColor: keywordSpecificColor(area.keywordStr),
              opacity: 0.3,
            }}
          />
        ))}
      </>
    );
  };

  const searchPluginInstance = searchPlugin({
    keyword: wordsToHighlight,
    renderHighlights,
  });

  return (
    <>
      <div className='m-3'>
        <button className="btn" onClick={handleRedaction}>  <Icon icon={IconNames.Plus} /> Add Redaction</button>
        <button className='btn'><Icon icon={IconNames.Endorsed} />  Accept All</button>
        <button className='btn'><Icon icon={IconNames.Bookmark} />  Save</button>
        <button className='btn'><Icon icon={IconNames.Redo} />  Redo</button>
        <button className='btn'><Icon icon="cross-circle" />  Cancel</button>
        <button className='btn'><Icon icon="cube-remove" />  Deselect</button>
        <button className='btn'><Icon icon="automatic-updates" />  Process</button>

        {contextMenuVisible && (
          <div
            className='context-menu'
            style={{
              top: contextMenuPosition.top,
              left: contextMenuPosition.left,
            }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className='bdiv'>
              <div style={{ marginLeft: 10 }}>
                <i className="fas fa-check"></i><Icon icon="confirm" />
                <button className='bt' onClick={handleAccept} style={{ marginLeft: 15 }}>Accept</button>
              </div>
            </div>

            {showReject && (
              <div className='bdiv'>
                <div style={{ marginLeft: 10 }}>
                  <i className="fas fa-x"></i><Icon icon="cross" />
                  <button className='bt' onClick={handleReject} style={{ marginLeft: 15 }}>Reject</button>
                </div>
              </div>
            )}
          </div>
        )}
        {optionsDisplay && (
          <div
            className='context-menu'
            style={{
              top: contextMenuPosition.top,
              left: contextMenuPosition.left + 202,
            }}
            onContextMenu={(e) => e.preventDefault()}
          >

            <div className='bdiv'>
              <div style={{ marginLeft: 10 }}>
                <i className="fas fa-person"></i>
                <button value={"person"} onClick={handleContextMenuChange} className='span1 bt' style={{ marginLeft: 15 }}>Person</button>
              </div>
            </div>
            <div className='bdiv'>
              <div style={{ marginLeft: 10 }}>
                <i className="fas fa-address-book"></i>
                <button value={"address"} onClick={handleContextMenuChange} className='span2 bt' style={{ marginLeft: 15 }}>Address</button>
              </div>
            </div>
            <div className='bdiv'>
              <div style={{ marginLeft: 10 }}>
                <i className="fas fa-building"></i>
                <button value={"org"} onClick={handleContextMenuChange} className='span3 bt' style={{ marginLeft: 15 }}>Organization</button>
              </div>
            </div>
            <div className='bdiv'>
              <div style={{ marginLeft: 10 }}>
                <i className="fas fa-envelope"></i>
                <button value={"email"} onClick={handleContextMenuChange} className='span4 bt' style={{ marginLeft: 15 }}>Email</button>
              </div>
            </div>

            <div className='bdiv'>
              <div style={{ marginLeft: 10 }}>
                <i className="fas fa-phone"></i>
                <button value={"phoneNumber"} onClick={handleContextMenuChange} className='span5 bt' style={{ marginLeft: 15 }}>Phone number</button>
              </div>
            </div>
          </div>
        )}

      </div>
      <div className='con'>
        <div className="container">
          <h2>PDF Redaction</h2>

          <div className='pbor' onMouseUp={handleSelection}>
            <Worker workerUrl={'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'}>
              {pdfView && (
                <Viewer
                  fileUrl={pdfView}
                  plugins={[defaultLayoutPluginInstance, searchPluginInstance]}
                  onDocumentLoad={(e) => console.log(`Number of pages: ${e.doc.numPages}`)}
                  onPageChange={handlePageChange}
                  key={wordsToHighlight.length}
                />
              )}
              {!pdfView && <>NO PDF</>}
            </Worker>
          </div>

          {tableDisplay && (
            <div className='elem'>

              <h2 style={{ textAlign: "center" }}>Annotations</h2>

              {displayData ? (

                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "35%" }}>Category</th>
                      <th>Values</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(displayData).map(([category, values]) => (
                      <tr key={category}>
                        <td><strong>{category}</strong></td>
                        <td>
                          {Array.isArray(values) ? (
                            values.map((value, index) => (
                              <span key={index}>{value}, </span>
                            ))
                          ) : (
                            <span>{values}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              ) : (
                <p>No data available for this page.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Pdf_text;
