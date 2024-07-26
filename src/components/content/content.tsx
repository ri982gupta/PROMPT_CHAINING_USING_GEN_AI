import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./Content.scss";
import { Spinner } from "@blueprintjs/core";
import Dashboard from "../../views/dashboard/dashboard";
import Upload_Document from "../../views/Upload_Document/Upload_Document";
import Scheduler from "../../views/scheduler/Scheduler";
import UserManagement from "../../views/userManagement/UserManagement";
import Audit from "../../views/audit/Audit";
import Reports from "../../views/reports/reports";
import NewJob from "../../views/newJob/NewJob";
import Pdf_text from "../../views/Upload_Document/pdf_text";
import Signup from "../../auth/signup";
import Signin from "../../auth/signin";


const Content = () => {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Routes>
            
        <Route >
          <Route path="/upload-document" element={<Upload_Document/>} />
        </Route>


        <Route>
          <Route path="/injest-doc-repo" element={<Dashboard/>} />
        </Route>

        <Route >
          <Route path="/pdf_text" element={<Pdf_text/>} />
        </Route>

        <Route>
          <Route path="/create-job" element={<Scheduler />} />
        </Route>

        <Route >
          <Route path="/user-management" element={<UserManagement />} />
        </Route>

        <Route >
          <Route path="/audit" element={<Audit />} />
        </Route>
        
        <Route >
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route >
          <Route path="/new-job" element={<NewJob/>} />
        </Route>
        
        <Route >
          <Route path="/signup" element={<Signup/>} />
        </Route>

        <Route >
          <Route path="/signin" element={<Signin/>} />
        </Route>

        <Route >
          <Route path="/dashboard" element={<Dashboard/>} />
        </Route>
        

        </Routes>
      </Suspense>
    </div>
  );
};

export default Content;
