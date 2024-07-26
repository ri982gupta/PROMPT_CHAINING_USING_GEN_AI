// AlmHomePage.jsx

import React, { useState } from 'react';
import userstyles from './AlmHomePage.module.scss';
import AutoML from '../../React Flow/AutoML';
import {
  Button,
  Dialog,
  Classes,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Menu,
  MenuItem,
  Popover,
  Alert,
  Icon
} from '@blueprintjs/core';

const AlmHomePage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectField, setProjectField] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [assignedProjectConfirmation, setAssignedProjectConfirmation] = useState(null);
  const[isreactflow, setReactflow] = useState(false)

  const projectContents = [
    'project 1',
    'project 2',
    'project 3',
    'project 4',
    'project 5',
    'project 6',
    'project 7',
    'project 8',
    'project 9',
    'project 10'
  ];

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleProjectFieldChange = (event) => {
    setProjectField(event.target.value);
  };

  const handleAddProject = () => {
    if (projectName.trim() !== '' && projectField.trim() !== '') {
      const newProject = `${projectName} - ${projectField}`;
      setProjects([...projects, newProject]);
      setProjectName('');
      setProjectField('');
      setOpenDialog(false);
      setAssignedProjectConfirmation(`Project "${newProject}" added successfully.`);
      setReactflow(true)
    
    }
  };

  const handleDeleteProject = (index) => {
    setShowDeleteConfirmation(true);
    setDeleteIndex(index);
  };

  const confirmDelete = (confirmed) => {
    if (confirmed && deleteIndex !== null) {
      const updatedProjects = projects.filter((_, i) => i !== deleteIndex);
      setProjects(updatedProjects);
    }
    setShowDeleteConfirmation(false);
    setDeleteIndex(null);
  };

  const handleUpdateProject = (index) => {
    setSelectedItemIndex(index);
    const projectNumber = `Project ${index + 1}`;
    setAssignedProjectConfirmation(`React Flow Presentation Here - ${projectNumber}`);
    setReactflow(true)
  };

  const handleMenuClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleProjectDivClick = () => {
    setSelectedItemIndex(null);
    setAssignedProjectConfirmation(null);
  };

  return (
    <div className={userstyles.container}>
      
      <div className={userstyles.addSection}>
        <div className={userstyles.addButton}>
          <div className={userstyles.box_add} onClick={handleDialogOpen}>
            <Icon icon="add" size={40} />
          </div>
        </div>

        <div className={userstyles.top}>
          {projectContents.map((content, index) => (
            <div key={index} className={userstyles.box} onClick={() => handleProjectDivClick()}>
              {content}
              <Popover
                content={
                  <Menu>
                    {/* {isreactflow && <AutoML />} */}
                    <MenuItem
                      text="Update"
                      onClick={() => handleUpdateProject(index)}
                      disabled={selectedItemIndex !== null && selectedItemIndex !== index}
                    />
                    <MenuItem
                      text="Delete"
                      onClick={() => handleDeleteProject(index)}
                      disabled={selectedItemIndex !== null && selectedItemIndex !== index}
                    />
                  </Menu>
                }
                position="bottom"
              >
                <div className={userstyles.menu} onClick={() => handleMenuClick(index)}>
                  ≡
                </div>
              </Popover>
              {showDeleteConfirmation && deleteIndex === index && (
                <Alert
                  cancelButtonText="No"
                  confirmButtonText="Yes"
                  icon="trash"
                  intent="danger"
                  isOpen={showDeleteConfirmation}
                  onCancel={() => confirmDelete(false)}
                  onConfirm={() => confirmDelete(true)}
                >
                  {`Are you sure you want to delete "${projectContents[index]}" project?`}
                </Alert>
              )}
            </div>
          ))}
        </div>
        
      </div>

                
      {isreactflow && <AutoML />}

      {/* <div className={userstyles.bottom}>
        {assignedProjectConfirmation && <div>{assignedProjectConfirmation}</div>}
      </div> */}

      <Dialog isOpen={openDialog} onClose={handleDialogClose} title="Add Project">
        <div className={Classes.DIALOG_BODY}>
          <FormGroup label="Project Name" labelFor="project-name-input" inline>
            <InputGroup
              id="project-name-input"
              value={projectName}
              onChange={handleProjectNameChange}
              placeholder="Enter Project Name"
            />
          </FormGroup>
          <FormGroup label="Project Field" labelFor="project-field-select" inline>
            <HTMLSelect
              id="project-field-select"
              value={projectField}
              onChange={handleProjectFieldChange}
              options={['Technology', 'Finance', 'HR']}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
        
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button
              intent="primary"
              onClick={handleAddProject}
              rightIcon={<span className={userstyles.add}></span>}
            >
              Add
            </Button>
            
          </div>
        </div>
      </Dialog>

      {assignedProjectConfirmation && (
        <Alert
          isOpen={!!assignedProjectConfirmation}
          confirmButtonText="OK"
          icon="tick-circle"
          intent="success"
          onClose={() => setAssignedProjectConfirmation(null)}
        >
          {assignedProjectConfirmation}
        </Alert>
      )}
    </div>

    
  );
};

export default AlmHomePage;
