import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size    = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0C0C0C",
          width:  "100%",
          height: "100%",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Gold top border */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "#C9A87C",
          }}
        />
        {/* NW letters */}
        <div
          style={{
            display:        "flex",
            alignItems:     "baseline",
            gap: 0,
          }}
        >
          <span
            style={{
              fontFamily:    "monospace",
              fontSize:      13,
              fontWeight:    700,
              color:         "#FFFFFF",
              letterSpacing: "0.08em",
            }}
          >
            ST
          </span>
          <span
            style={{
              fontFamily:    "monospace",
              fontSize:      10,
              color:         "rgba(201,168,124,0.6)",
              letterSpacing: "0.04em",
              marginLeft:    1,
            }}
          >
            ./
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
