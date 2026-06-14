import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Room({
  floorImageUrl,
  wallImageUrl,
  roomLength,
  roomWidth,
  roomHeight,
  tileWidth,
  tileHeight,
  viewMode,
}) {
  const floorTexture = useTexture(floorImageUrl);
  const wallTexture = useTexture(wallImageUrl);

  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;

  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;

  floorTexture.repeat.set(
    roomLength / tileWidth,
    roomWidth / tileHeight
  );

  wallTexture.repeat.set(
    roomLength / tileWidth,
    roomHeight / tileHeight
  );

  const showFloor =
    viewMode === "floor" ||
    viewMode === "both";

  const showWalls =
    viewMode === "walls" ||
    viewMode === "both";

  return (
    <>
      <ambientLight intensity={2} />

      {showFloor && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry
            args={[roomLength, roomWidth]}
          />
          <meshStandardMaterial
            map={floorTexture}
          />
        </mesh>
      )}

      {showWalls && (
        <>
          <mesh
            position={[
              0,
              roomHeight / 2,
              -roomWidth / 2,
            ]}
          >
            <planeGeometry
              args={[
                roomLength,
                roomHeight,
              ]}
            />
            <meshStandardMaterial
              map={wallTexture}
            />
          </mesh>

          <mesh
            rotation={[0, Math.PI / 2, 0]}
            position={[
              -roomLength / 2,
              roomHeight / 2,
              0,
            ]}
          >
            <planeGeometry
              args={[
                roomWidth,
                roomHeight,
              ]}
            />
            <meshStandardMaterial
              map={wallTexture}
            />
          </mesh>

          <mesh
            rotation={[0, -Math.PI / 2, 0]}
            position={[
              roomLength / 2,
              roomHeight / 2,
              0,
            ]}
          >
            <planeGeometry
              args={[
                roomWidth,
                roomHeight,
              ]}
            />
            <meshStandardMaterial
              map={wallTexture}
            />
          </mesh>
        </>
      )}
    </>
  );
}

export default function App() {
  const [isMobile, setIsMobile] =
    useState(window.innerWidth < 768);

  const [showPanel, setShowPanel] =
    useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth < 768;

      setIsMobile(mobile);

      if (!mobile) {
        setShowPanel(true);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const [floorImageUrl,
    setFloorImageUrl] =
    useState("/elbis-multi.jpg");

  const [wallImageUrl,
    setWallImageUrl] =
    useState("/elbis-multi.jpg");

  const [lengthInch,
    setLengthInch] =
    useState(120);

  const [widthInch,
    setWidthInch] =
    useState(96);

  const [heightInch,
    setHeightInch] =
    useState(108);

  const [tileWidthInch,
    setTileWidthInch] =
    useState(24);

  const [tileHeightInch,
    setTileHeightInch] =
    useState(48);

  const [tilesPerBox,
    setTilesPerBox] =
    useState(4);

  const [wastagePercent,
    setWastagePercent] =
    useState(10);

  const [viewMode,
    setViewMode] =
    useState("both");
  const roomLength =
    lengthInch * 0.0254;

  const roomWidth =
    widthInch * 0.0254;

  const roomHeight =
    heightInch * 0.0254;

  const tileWidth =
    tileWidthInch * 0.0254;

  const tileHeight =
    tileHeightInch * 0.0254;

  const roomArea =
    (lengthInch * widthInch) / 144;

  const tileArea =
    (tileWidthInch * tileHeightInch) / 144;

  const tilesRequired = Math.ceil(
    roomArea / tileArea
  );

  const tilesWithWaste = Math.ceil(
    tilesRequired *
      (1 + wastagePercent / 100)
  );

  const boxesRequired = Math.ceil(
    tilesWithWaste / tilesPerBox
  );

  const bathroomPresets = {
    Small: {
      length: 96,
      width: 72,
      height: 96,
    },
    Medium: {
      length: 120,
      width: 96,
      height: 108,
    },
    Large: {
      length: 144,
      width: 120,
      height: 120,
    },
  };

  const handleFloorUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFloorImageUrl(
        URL.createObjectURL(file)
      );
    }
  };

  const handleWallUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setWallImageUrl(
        URL.createObjectURL(file)
      );
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  return (
    <>
      <button
        onClick={() =>
          setShowPanel(!showPanel)
        }
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 999,
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          background: "#1976d2",
          color: "white",
          cursor: "pointer",
        }}
      >
        ☰ Menu
      </button>

      {showPanel && (
        <div
          style={{
            position: "absolute",
            top: isMobile ? 0 : 10,
            left: isMobile ? 0 : 10,
            zIndex: 100,
            background: "white",
            padding: 15,
            width: isMobile
              ? "100vw"
              : 320,
            maxWidth: "320px",
            borderRadius:
              isMobile ? 0 : 10,
            maxHeight: isMobile
              ? "50vh"
              : "90vh",
            overflowY: "auto",
            boxShadow:
              "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <h2>
            Tile Visualizer Mobile
          </h2>

          <h4>Bathroom Preset</h4>

          <select
            style={inputStyle}
            onChange={(e) => {
              const preset =
                bathroomPresets[
                  e.target.value
                ];

              if (preset) {
                setLengthInch(
                  preset.length
                );
                setWidthInch(
                  preset.width
                );
                setHeightInch(
                  preset.height
                );
              }
            }}
          >
            <option>Select</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>

          <hr />

          <h4>Floor Tile</h4>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleFloorUpload
            }
            style={inputStyle}
          />

          <br />
          <br />

          <h4>Wall Tile</h4>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleWallUpload
            }
            style={inputStyle}
          />

          <hr />
          <label>Room Length (inch)</label>
          <input
            type="number"
            value={lengthInch}
            onChange={(e) =>
              setLengthInch(
                Number(e.target.value)
              )
            }
            style={inputStyle}
          />

          <br /><br />

          <label>Room Width (inch)</label>
          <input
            type="number"
            value={widthInch}
            onChange={(e) =>
              setWidthInch(
                Number(e.target.value)
              )
            }
            style={inputStyle}
          />

          <br /><br />

          <label>Room Height (inch)</label>
          <input
            type="number"
            value={heightInch}
            onChange={(e) =>
              setHeightInch(
                Number(e.target.value)
              )
            }
            style={inputStyle}
          />

          <hr />

          <label>Tile Width (inch)</label>
          <input
            type="number"
            value={tileWidthInch}
            onChange={(e) =>
              setTileWidthInch(
                Number(e.target.value)
              )
            }
            style={inputStyle}
          />

          <br /><br />

          <label>Tile Height (inch)</label>
          <input
            type="number"
            value={tileHeightInch}
            onChange={(e) =>
              setTileHeightInch(
                Number(e.target.value)
              )
            }
            style={inputStyle}
          />

          <hr />

          <label>Tiles Per Box</label>
          <input
            type="number"
            value={tilesPerBox}
            onChange={(e) =>
              setTilesPerBox(
                Number(e.target.value)
              )
            }
            style={inputStyle}
          />

          <br /><br />

          <label>Wastage %</label>
          <input
            type="number"
            value={wastagePercent}
            onChange={(e) =>
              setWastagePercent(
                Number(e.target.value)
              )
            }
            style={inputStyle}
          />

          <hr />

          <h4>Calculator</h4>

          <p>
            Area: {roomArea.toFixed(2)} sq ft
          </p>

          <p>
            Tiles Required: {tilesRequired}
          </p>

          <p>
            With Wastage: {tilesWithWaste}
          </p>

          <p>
            Boxes Required: {boxesRequired}
          </p>

          <hr />

          <select
            value={viewMode}
            onChange={(e) =>
              setViewMode(e.target.value)
            }
            style={inputStyle}
          >
            <option value="floor">
              Floor Only
            </option>

            <option value="walls">
              Walls Only
            </option>

            <option value="both">
              Floor + Walls
            </option>
          </select>

        </div>
      )}
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <Canvas
          camera={{
            position: isMobile
              ? [4, 3, 4]
              : [6, 4, 6],
            fov: isMobile ? 60 : 50,
          }}
        >
          <Room
            floorImageUrl={floorImageUrl}
            wallImageUrl={wallImageUrl}
            roomLength={roomLength}
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            tileWidth={tileWidth}
            tileHeight={tileHeight}
            viewMode={viewMode}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />

          <gridHelper args={[20, 20]} />
        </Canvas>
      </div>
    </>
  );
}