import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { IconNames } from "@blueprintjs/icons";
import { Icon } from "@blueprintjs/core";

const Handler = ({
  data,
  isConnectable,
}:
NodeProps) => {
  return (
    <>
      
      <Handle
        type="source"
        style={{
          width: "8px",
          height: "10px",
          borderRadius: "3px",
          background: "#ff0072",
        }}
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        style={{
          width: "8px",
          height: "10px",
          borderRadius: "3px",
          background: "#ff0072",
        }}
        id="b"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </>
  );
};

Handler.displayName = "Handler";

export default memo(Handler);

export {};
