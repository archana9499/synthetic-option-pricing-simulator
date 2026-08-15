import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./App.css";

import SimulatorControls from "./components/SimulatorControls";
import StrikeFilter from "./components/StrikeFilter";
import PricingTable from "./components/PricingTable";

import type {
  PricingData,
  PriceDirection,
} from "./types/pricing";

function App() {
  // -----------------------------
  // Pricing data
  // -----------------------------

  const [pricingData, setPricingData] =
    useState<PricingData | null>(null);

  // -----------------------------
  // Filters
  // -----------------------------

  const [minStrike, setMinStrike] =
    useState("");

  const [maxStrike, setMaxStrike] =
    useState("");

  // -----------------------------
  // Simulator controls
  // -----------------------------

  const [startingPrice, setStartingPrice] =
    useState("20000");

  const [frequency, setFrequency] =
    useState("1");

  const [volatility, setVolatility] =
    useState("20");

  // -----------------------------
  // Connection / simulator state
  // -----------------------------

  const [isConnected, setIsConnected] =
    useState(false);

  const [isRunning, setIsRunning] =
    useState(false);

  const [websocket, setWebsocket] =
    useState<WebSocket | null>(null);

  // -----------------------------
  // Price-change tracking
  // -----------------------------

  const previousPricingData =
    useRef<PricingData | null>(null);

  const [priceChanges, setPriceChanges] =
    useState<
      Record<string, PriceDirection>
    >({});

  const changeTimers =
    useRef<
      Record<
        string,
        ReturnType<typeof setTimeout>
      >
    >({});

  // -----------------------------
  // WebSocket connection
  // -----------------------------

  useEffect(() => {
    const websocketUrl =
      import.meta.env.VITE_WS_URL ||
      "ws://127.0.0.1:8000/ws";

    const ws = new WebSocket(
      websocketUrl
    );

    ws.onopen = () => {
      console.log(
        "WebSocket connected"
      );

      setIsConnected(true);
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      const data: PricingData =
        JSON.parse(event.data);

      setPricingData(data);
    };

    ws.onerror = (error) => {
      console.error(
        "WebSocket error:",
        error
      );
    };

    ws.onclose = () => {
      console.log(
        "WebSocket disconnected"
      );

      setIsConnected(false);
      setWebsocket(null);
      setIsRunning(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  // -----------------------------
  // Detect price changes
  // -----------------------------

  useEffect(() => {
    const previous =
      previousPricingData.current;

    if (!previous || !pricingData) {
      previousPricingData.current =
        pricingData;

      return;
    }

    const changes: Record<
      string,
      PriceDirection
    > = {};

    pricingData.options.forEach(
      (currentOption) => {
        const previousOption =
          previous.options.find(
            (option) =>
              option.strike ===
              currentOption.strike
          );

        if (!previousOption) {
          return;
        }

        // Call price change
        if (
          currentOption.call !==
          previousOption.call
        ) {
          const key =
            `${currentOption.strike}-call`;

          changes[key] =
            currentOption.call >
            previousOption.call
              ? "up"
              : "down";
        }

        // Put price change
        if (
          currentOption.put !==
          previousOption.put
        ) {
          const key =
            `${currentOption.strike}-put`;

          changes[key] =
            currentOption.put >
            previousOption.put
              ? "up"
              : "down";
        }
      }
    );

    if (Object.keys(changes).length > 0) {
      setPriceChanges((current) => ({
        ...current,
        ...changes,
      }));

      Object.keys(changes).forEach(
        (key) => {
          if (changeTimers.current[key]) {
            clearTimeout(
              changeTimers.current[key]
            );
          }

          changeTimers.current[key] =
            setTimeout(() => {
              setPriceChanges(
                (current) => {
                  const updated = {
                    ...current,
                  };

                  delete updated[key];

                  return updated;
                }
              );

              delete changeTimers.current[
                key
              ];
            }, 500);
        }
      );
    }

    previousPricingData.current =
      pricingData;
  }, [pricingData]);

  // -----------------------------
  // Cleanup timers
  // -----------------------------

  useEffect(() => {
    return () => {
      Object.values(
        changeTimers.current
      ).forEach(clearTimeout);
    };
  }, []);

  // -----------------------------
  // Send WebSocket command
  // -----------------------------

  const sendCommand = (
    message: object
  ) => {
    if (
      websocket &&
      websocket.readyState ===
        WebSocket.OPEN
    ) {
      websocket.send(
        JSON.stringify(message)
      );
    }
  };

  // -----------------------------
  // Start
  // -----------------------------

  const handleStart = () => {
    sendCommand({
      type: "start",
    });

    setIsRunning(true);
  };

  // -----------------------------
  // Stop
  // -----------------------------

  const handleStop = () => {
    sendCommand({
      type: "stop",
    });

    setIsRunning(false);
  };

  // -----------------------------
  // Reset
  // -----------------------------

  const handleReset = () => {
    sendCommand({
      type: "reset",
    });

    setPriceChanges({});
  };

  // -----------------------------
  // Starting price
  // -----------------------------

  const handleStartingPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.value;

    setStartingPrice(value);

    const numericValue =
      Number(value);

    if (numericValue > 0) {
      sendCommand({
        type: "set_starting_price",
        value: numericValue,
      });
    }
  };

  // -----------------------------
  // Frequency
  // -----------------------------

  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value;

    setFrequency(value);

    sendCommand({
      type: "set_frequency",
      value: Number(value),
    });
  };

  // -----------------------------
  // Volatility
  // -----------------------------

  const handleVolatilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.value;

    setVolatility(value);

    const numericValue =
      Number(value);

    if (
      numericValue >= 1 &&
      numericValue <= 200
    ) {
      sendCommand({
        type: "set_volatility",
        value: numericValue / 100,
      });
    }
  };

  // -----------------------------
  // Filter options
  // -----------------------------

  const filteredOptions =
    pricingData?.options.filter(
      (option) => {
        const minimum =
          minStrike === ""
            ? -Infinity
            : Number(minStrike);

        const maximum =
          maxStrike === ""
            ? Infinity
            : Number(maxStrike);

        return (
          option.strike >= minimum &&
          option.strike <= maximum
        );
      }
    ) ?? [];

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <main className="app">

      {/* Header */}

      <header className="header">
        <div>
          <p className="eyebrow">
            MARKET SIMULATOR
          </p>

          <h1>
            Synthetic Option Pricing
          </h1>

          <p className="subtitle">
            Real-time Black-Scholes
            pricing and analytics
          </p>
        </div>

        <div
          className={`connection ${
            isConnected
              ? "connected"
              : "disconnected"
          }`}
        >
          <span className="status-dot" />

          {isConnected
            ? "WebSocket Connected"
            : "Disconnected"}
        </div>
      </header>

      {/* Dashboard cards */}

      <section className="dashboard-grid">

        {/* Spot price */}

        <div className="card spot-card">
          <div className="card-label">
            UNDERLYING
          </div>

          <div className="spot-symbol">
            DEMO
          </div>

          <div className="spot-price">
            {pricingData
              ? pricingData.spot.toFixed(2)
              : "—"}
          </div>

          <div className="update-time">
            {pricingData
              ? `Updated ${new Date(
                  pricingData.timestamp
                ).toLocaleTimeString()}`
              : "Waiting for data..."}
          </div>
        </div>

        {/* Simulator status */}

        <div className="card status-card">
          <div className="card-label">
            SIMULATOR STATUS
          </div>

          <div
            className={`simulator-status ${
              isRunning
                ? "running"
                : "stopped"
            }`}
          >
            <span className="status-dot" />

            {isRunning
              ? "Running"
              : "Stopped"}
          </div>

          <p>
            Updates every{" "}
            <strong>
              {frequency === "0.1"
                ? "100 ms"
                : frequency === "0.5"
                ? "500 ms"
                : "1000 ms"}
            </strong>
          </p>
        </div>
      </section>

      {/* Simulator controls */}

      <section className="card controls-card">
        <SimulatorControls
          startingPrice={startingPrice}
          frequency={frequency}
          volatility={volatility}
          isConnected={isConnected}
          isRunning={isRunning}
          onStartingPriceChange={
            handleStartingPriceChange
          }
          onFrequencyChange={
            handleFrequencyChange
          }
          onVolatilityChange={
            handleVolatilityChange
          }
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
        />
      </section>

      {/* Pricing data */}

      {pricingData ? (
        <>
          {/* Strike filter */}

          <section className="card filter-card">
            <StrikeFilter
              minStrike={minStrike}
              maxStrike={maxStrike}
              onMinStrikeChange={
                setMinStrike
              }
              onMaxStrikeChange={
                setMaxStrike
              }
            />
          </section>

          {/* Pricing table */}

          <section className="card table-card">
            <PricingTable
              options={filteredOptions}
              priceChanges={priceChanges}
            />
          </section>
        </>
      ) : (
        /* Empty state */

        <section className="empty-state">
          <div className="loading-spinner" />

          <p>
            Waiting for pricing data...
          </p>

          <span>
            Connect to the simulator
            and press Start.
          </span>
        </section>
      )}

      {/* Footer */}

      <footer>
        Synthetic Option Pricing
        Simulator
      </footer>
    </main>
  );
}

export default App;