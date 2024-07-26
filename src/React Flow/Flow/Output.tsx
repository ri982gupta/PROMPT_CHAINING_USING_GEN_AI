import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { IconNames } from "@blueprintjs/icons";
import {Icon} from "@blueprintjs/core";

const Output= ({
  data,
  isConnectable,
  // targetPosition = Position.Left,
  // sourcePosition = Position.Right
}: NodeProps) => {
  return (
    <>
    <div>
    <Icon size={45} icon="document"/>
    </div>
    {data?.database}
      <Handle
        type="source"
        style={{width:'8px',height:'10px',borderRadius:'3px',background:'black'}}
        position={Position.Right}
        isConnectable={isConnectable}
      />
       {/* <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      /> */}
      
    </>
  );
};

Output.displayName = "Output";

export default memo(Output);

export {}
