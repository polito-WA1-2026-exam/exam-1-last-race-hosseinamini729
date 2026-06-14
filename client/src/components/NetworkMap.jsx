import { useEffect, useRef } from "react";
import { Network } from "vis-network";

const NetworkMap = ({ networkData }) => {
  // Reference to the DOM element where the graph will be rendered
  const mapContainer = useRef(null);
  // Store the network instance to clean it up when the component unmounts
  const networkInstance = useRef(null);

  useEffect(() => {
    if (networkData && mapContainer.current) {
      // Helper function to assign distinct colors to different subway lines
      const getLineColor = (lineId) => {
        const colors = {
          1: "#ff4d4d",
          2: "#3399ff",
          3: "#33cc33",
          4: "#ffcc00",
        };
        return colors[lineId] || "#999999";
      };

      // Map the backend stations data to vis-network 'nodes' format
      const nodes = networkData.stations.map((station) => ({
        id: station.id,
        label: station.name,
        shape: "dot",
        size: 15,
        color: { background: "#ffffff", border: "#333333" },
        font: {
          size: 14,
          face: "Arial",
          color: "#000000",
          background: "rgba(255, 255, 255, 0.7)",
        },
      }));

      // Map the backend segments data to vis-network 'edges' format
      const edges = networkData.segments.map((segment) => ({
        from: segment.station_a_id,
        to: segment.station_b_id,
        color: { color: getLineColor(segment.line_id), highlight: "#000000" },
        width: 4,
        smooth: { type: "continuous" }, // Makes the lines slightly curved for better visual appeal
      }));

      const data = { nodes, edges };

      // Configuration options for the graph's physics and layout
      const options = {
        physics: {
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 150,
            springConstant: 0.04,
          },
          stabilization: { iterations: 150 },
        },
        interaction: {
          zoomView: true,
          dragView: true,
          dragNodes: true,
          hover: true,
        },
      };

      // Create and store the network instance
      networkInstance.current = new Network(
        mapContainer.current,
        data,
        options,
      );
    }

    // Cleanup function to destroy the graph instance when unmounting to prevent memory leaks
    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
        networkInstance.current = null;
      }
    };
  }, [networkData]);

  return (
    <div
      ref={mapContainer}
      style={{
        height: "600px",
        width: "100%",
        backgroundColor: "#f8f9fa",
        borderRadius: "0.375rem",
      }}
    />
  );
};

export default NetworkMap;
