import React, { useEffect, useState } from 'react';
import userstyles from './UserAdmin.module.scss';
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
import { IconNames } from '@blueprintjs/icons';
import axios from 'axios';

interface SelectedProjects {
  [key: string]: boolean;
}

const UserAdministration: React.FC = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeField, setEmployeeField] = useState<string>('');
  const [employeeSurname, setEmployeeSurname] = useState<string>('');
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [selectedEmployeeIndexForUpdate, setSelectedEmployeeIndexForUpdate] = useState<number | null>(null);
  const [projectsForUpdate, setProjectsForUpdate] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<SelectedProjects>({});
  const [showProjectSave, setShowProjectSave] = useState<boolean>(true);
  const [selectedPersonProjects, setSelectedPersonProjects] = useState<{ [key: number]: SelectedProjects }>({});
  const [assignedProjectsConfirmation, setAssignedProjectsConfirmation] = useState<string | null>(null);

  useEffect(() => {
    const getApplications = async () => {
      const response = await axios.get('http://localhost:3001/applications');
      console.log(response.data);
    };
    getApplications();
  }, []);

  const divContents: string[] = [
    'person 1',
    'person 2',
    'person 3',
    'person 1',
    'person 2',
    'person 3',
    'person 1',
    'person 2',
    'person 3',
    'person 1',
    'person 2',
    'person 3',
    'person 1',
    'person 2'
  ];

  const projects: string[] = [
    'project 1',
    'project 2',
    'project 3',
    'project 4',
    'project 5',
    'project 6',
    'project 7',
    'project 8',
    'project 9'
  ];

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEmployeeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeName(event.target.value);
  };

  const handleEmployeeSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeSurname(event.target.value);
  };

  const handleEmployeeFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEmployeeField(event.target.value);
  };

  const handleAddEmployee = () => {
    console.log(`Employee Name: ${employeeName} ${employeeSurname}, Field: ${employeeField}`);
    const newEmployee = `${employeeName} ${employeeSurname}`;
    setEmployees([...employees, newEmployee]);
    setEmployeeName('');
    setEmployeeSurname('');
    setEmployeeField('');
    setOpenDialog(false);
    setAssignedProjectsConfirmation(`Employee ${newEmployee} added successfully.`);
  };

  const handleDeleteEmployee = (index: number) => {
    setShowDeleteConfirmation(true);
    setDeleteIndex(index);
  };

  const confirmDelete = (confirmed: boolean) => {
    if (confirmed && deleteIndex !== null) {
      const updatedEmployees = employees.filter((_, i) => i !== deleteIndex);
      setEmployees(updatedEmployees);
    }
    setShowDeleteConfirmation(false);
    setDeleteIndex(null);
  };

  const handleUpdateEmployee = (index: number) => {
    console.log(`Update employee at index ${index}`);
    setSelectedEmployeeIndexForUpdate(index);
    setShowProjectSave(true);

    if (selectedPersonProjects[index] !== undefined) {
      setSelectedProjects(selectedPersonProjects[index]);
    } else {
      setSelectedProjects({});
    }
  };

  const handleMenuClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const handleProjectCheckboxChange = (project: string) => {
    const updatedSelectedProjects = { ...selectedProjects };
    updatedSelectedProjects[project] = !updatedSelectedProjects[project];
    setSelectedProjects(updatedSelectedProjects);
  };

  const handlePersonDivClick = () => {
    setShowProjectSave(true);
  };

  const handleProjectSave = () => {
    if (selectedEmployeeIndexForUpdate !== null && selectedEmployeeIndexForUpdate !== undefined) {
      setSelectedPersonProjects({
        ...selectedPersonProjects,
        [selectedEmployeeIndexForUpdate]: selectedProjects,
      });

      const updatedEmployees = [...employees];
      const updatedEmployeeName =
        updatedEmployees[selectedEmployeeIndexForUpdate] || `Person ${selectedEmployeeIndexForUpdate + 1}`;
      setAssignedProjectsConfirmation(`Projects assigned to ${updatedEmployeeName} successfully.`);
    }
  };

  return (
    <div className={userstyles.container}>
      <div className={userstyles.addSection}>
        <div className={userstyles.addButton}>
          <div className={userstyles.box_add} onClick={handleDialogOpen}>
            <Icon icon="add" size={40} />
          </div>
          {showProjectSave && (
            <div className={userstyles.box_save} onClick={handleProjectSave}>
              project<br />
              save
            </div>
          )}
        </div>

        <div className={userstyles.top}>
          {divContents.map((content, index) => (
            <div key={index} className={userstyles.box} onClick={handlePersonDivClick}>
              {content}
              {(
                <Popover
                  content={
                    <Menu>
                      <MenuItem
                        text="Update"
                        onClick={() => handleUpdateEmployee(index)}
                        disabled={selectedItemIndex !== null && selectedItemIndex !== index}
                      />
                      <MenuItem
                        text="Delete"
                        onClick={() => handleDeleteEmployee(index)}
                        disabled={selectedItemIndex !== null && selectedItemIndex !== index}
                      />
                    </Menu>
                  }
                  position="bottom"
                >
                  <div className={userstyles.menu} onClick={() => handleMenuClick(index)}>≡</div>
                </Popover>
              )}
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
                  {`Are you sure you want to delete ${divContents[index]}?`}
                </Alert>
              )}
            </div>
          ))}
          {employees.map((emp, index) => (
            <div key={index} className={userstyles.box} onClick={handlePersonDivClick}>
              {emp}
              <Popover
                content={
                  <Menu>
                    <MenuItem
                      text="Update"
                      onClick={() => handleUpdateEmployee(index + divContents.length)}
                      disabled={selectedItemIndex !== null && selectedItemIndex !== index + divContents.length}
                    />
                    <MenuItem
                      text="Delete"
                      onClick={() => handleDeleteEmployee(index + divContents.length)}
                      disabled={selectedItemIndex !== null && selectedItemIndex !== index + divContents.length}
                    />
                  </Menu>
                }
                position="bottom"
              >
                <div className={userstyles.menu} onClick={() => handleMenuClick(index + divContents.length)}>≡</div>
              </Popover>

            </div>

          ))}

        </div>
      </div>

      <div className={userstyles.bottom}>
        {selectedEmployeeIndexForUpdate !== null &&
          selectedEmployeeIndexForUpdate !== undefined ? (
            projects.map((content, index) => (
              <div key={index} className={userstyles.box_project}>
                <input
                  type="checkbox"
                  className={userstyles.checkbox}
                  checked={selectedProjects[content]}
                  onChange={() => handleProjectCheckboxChange(content)}
                />
                {content}
              </div>
            ))
          ) : null}
      </div>
      <Dialog isOpen={openDialog} onClose={handleDialogClose} title="Add Employee">
        <div className={Classes.DIALOG_BODY}>
          <FormGroup label="Employee Name" labelFor="employee-name-input" inline>
            <InputGroup
              id="employee-name-input"
              value={employeeName}
              onChange={handleEmployeeNameChange}
              placeholder="Enter Employee Name"
            />
          </FormGroup>
          <FormGroup label="Employee Surname" labelFor="employee-Surname-input" inline>
            <InputGroup
              id="employee-Surname-input"
              value={employeeSurname}
              onChange={handleEmployeeSurnameChange}
              placeholder="Enter Employee Surname"
            />
          </FormGroup>
          <FormGroup label="Employee Field" labelFor="employee-field-select" inline>
            <HTMLSelect
              id="employee-field-select"
              value={employeeField}
              onChange={handleEmployeeFieldChange}
              options={['Technical', 'Finance', 'HR']}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button
              intent="primary"
              onClick={handleAddEmployee}
              rightIcon={<span className={userstyles.add}>Add</span>}
            >
              Add
            </Button>
          </div>
        </div>
      </Dialog>

      {assignedProjectsConfirmation && (
        <Alert
          isOpen={!!assignedProjectsConfirmation}
          confirmButtonText="OK"
          icon="tick-circle"
          intent="success"
          onClose={() => setAssignedProjectsConfirmation(null)}
        >
          {assignedProjectsConfirmation}
        </Alert>
      )}
    </div>
  );
};

export default UserAdministration;
