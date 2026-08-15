import type { ChangeEvent } from "react";

interface SimulatorControlsProps {
  startingPrice: string;
  frequency: string;
  volatility: string;
  isConnected: boolean;
  isRunning: boolean;
  onStartingPriceChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onFrequencyChange: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;
  onVolatilityChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

function SimulatorControls({
  startingPrice,
  frequency,
  volatility,
  isConnected,
  isRunning,
  onStartingPriceChange,
  onFrequencyChange,
  onVolatilityChange,
  onStart,
  onStop,
  onReset,
}: SimulatorControlsProps) {
  return (
    <section>
      <h2>Simulator Controls</h2>

      <div>
        <label>
          Starting Price:{" "}
          <input
            type="number"
            min="1"
            value={startingPrice}
            onChange={onStartingPriceChange}
          />
        </label>
      </div>

      <br />

      <div>
        <label>
          Update Frequency:{" "}
          <select
            value={frequency}
            onChange={onFrequencyChange}
          >
            <option value="0.1">100 ms</option>
            <option value="0.5">500 ms</option>
            <option value="1">1000 ms</option>
          </select>
        </label>
      </div>

      <br />

      <div>
        <label>
          Volatility:{" "}
          <input
            type="number"
            min="1"
            max="200"
            step="1"
            value={volatility}
            onChange={onVolatilityChange}
          />
          %
        </label>
      </div>

      <br />

      <button
        onClick={onStart}
        disabled={!isConnected || isRunning}
      >
        Start
      </button>

      <button
        onClick={onStop}
        disabled={!isRunning}
      >
        Stop
      </button>

      <button
        onClick={onReset}
        disabled={!isConnected}
      >
        Reset
      </button>
    </section>
  );
}

export default SimulatorControls;