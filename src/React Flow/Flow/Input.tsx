import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import {Icon} from "@blueprintjs/core";

const Input= ({
  data,
  isConnectable,
}: NodeProps) => {
  return (
    <>
    <div>
    <Icon size={45} icon="database"/>
    </div>
    {data?.database}
       <Handle
        type="source"
        style={{width:'8px',height:'10px',borderRadius:'3px',background:'black'}}
        position= {Position.Right}
        isConnectable={isConnectable}
      />
      
    </>
  );
};

Input.displayName = "Input";

export default memo(Input);

export {}