import { Card, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import newJobStyles from "./newJob.module.scss";
import { useNavigate } from "react-router-dom";

const NewJob = () => {
    const navigate = useNavigate();
  return (
    <>
      <Card className={newJobStyles.Card}>
        <h2>New Job</h2>
        <br />
        <div className={newJobStyles.section1}>
          

          <div>
                Prompt
            </div>
            <textarea rows={10} placeholder="Example: URL: ___, Industry: ____, Geo: ____ Value: ____"  className={newJobStyles.textArea}/>
            <button onClick={() => navigate('/job')} className={newJobStyles.button}>
            <span className={newJobStyles.buttoncontent}>Save</span>
            </button>
        </div>

        <div className={newJobStyles.section2}>
        <FormGroup
            inline={true}
            className={newJobStyles.label}
            label="API Key"
            labelFor="text-input"
          >
            <InputGroup
              type="text"
              autoComplete="off"
            //   name="name"
              // className={esStyles.input}
              // value={data.name}
              // onChange={handleChange}
              id="input-1"
            />
          </FormGroup>
          
          <FormGroup
            inline={true}
            className={newJobStyles.label}
            label="UID"
            labelFor="text-input"
          >
            <InputGroup
              type="text"
              autoComplete="off"
            //   name="name"
              // className={esStyles.input}
              // value={data.name}
              // onChange={handleChange}
              id="input-4"
            />
          </FormGroup>
        </div>
      </Card>
    </>
  );
};

export default NewJob;
