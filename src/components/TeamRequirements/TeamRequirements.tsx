import React, { useState } from "react";
import "./team-reqs.css";
import { Button, FormControl, Paper } from "@mui/material";
import { requirements, selections } from "../../util";
import Picker from "react-mobile-picker";

const TeamRequirements = () => {
  const [pickerValue, setPickerValue] = useState({
    amount: 0,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputOptions, setInputOptions] = useState<string[]>([]);
  const startCreatePlayer = () => setIsCreating(true);

  return (
    <div className="players-input-container">
      <div className="team-reqs-container players-input">
        <h5 className="tab-header">Team Requirements</h5>
        <FormControl className="team-reqs-form">
          <div
            className="team-reqs-selection-header"
            style={{ blockSize: isCreating ? "0%" : "15%" }}
          >
            <Button
              className="add-req-btn full-width-btn"
              onClick={startCreatePlayer}
              sx={{ visibility: isCreating ? "hidden" : "visible" }}
            >
              add a requirement
            </Button>
          </div>
          <div
            className="team-reqs-selection-body"
            style={{ blockSize: isCreating ? "100%" : "85%" }}
          >
            <div
              className="new-req-container"
              style={{ visibility: isCreating ? "visible" : "hidden" }}
            >
              {showInput ? (
                <div className="new-req-input-container">
                  {inputOptions.map((opt) => (
                    <Picker
                      value={pickerValue}
                      onChange={setPickerValue}
                      wheelMode="normal"
                    >
                      {Object.keys(selections).map((name) => (
                        <Picker.Column key={name} name={name}>
                          {selections[name].map((option) => (
                            <Picker.Item key={option} value={option}>
                              {option}
                            </Picker.Item>
                          ))}
                        </Picker.Column>
                      ))}
                    </Picker>
                  ))}
                  {/* number input window */}
                  {/* job dropdown window */}
                </div>
              ) : (
                requirements.map((req) => (
                  <Button
                    className="requirement-btn"
                    variant="contained"
                    onClick={(event) => {
                      setShowInput(true);
                      setInputOptions(req.callback(event));
                    }}
                    fullWidth
                  >
                    {req.label}
                  </Button>
                ))
              )}
            </div>
          </div>
        </FormControl>
      </div>
    </div>
  );
};

export default TeamRequirements;
