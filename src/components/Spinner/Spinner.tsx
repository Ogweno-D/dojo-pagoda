import "./spinner.css";

export default function Spinner({ size = 40 }: { size?: number }) {
    return (
        <div className="spinner-container">
            <div
                className="spinner"
                style={{ width: size, height: size }}
            ></div>
        </div>
    );
}
