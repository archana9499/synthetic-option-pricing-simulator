interface StrikeFilterProps {
  minStrike: string;
  maxStrike: string;
  onMinStrikeChange: (
    value: string
  ) => void;
  onMaxStrikeChange: (
    value: string
  ) => void;
}

function StrikeFilter({
  minStrike,
  maxStrike,
  onMinStrikeChange,
  onMaxStrikeChange,
}: StrikeFilterProps) {
  return (
    <section>
      <h2>Strike Filter</h2>

      <label>
        Minimum Strike:{" "}
        <input
          type="number"
          value={minStrike}
          onChange={(event) =>
            onMinStrikeChange(
              event.target.value
            )
          }
          placeholder="e.g. 19900"
        />
      </label>

      {" "}

      <label>
        Maximum Strike:{" "}
        <input
          type="number"
          value={maxStrike}
          onChange={(event) =>
            onMaxStrikeChange(
              event.target.value
            )
          }
          placeholder="e.g. 20100"
        />
      </label>
    </section>
  );
}

export default StrikeFilter;