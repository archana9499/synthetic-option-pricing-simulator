import type {
  OptionPrice,
  PriceDirection,
} from "../types/pricing";

interface PricingTableProps {
  options: OptionPrice[];
  priceChanges: Record<
    string,
    PriceDirection
  >;
}

function PricingTable({
  options,
  priceChanges,
}: PricingTableProps) {
  return (
    <section>
      <h2>Option Pricing</h2>

      <table>
        <thead>
          <tr>
            <th>Strike</th>
            <th>Call Price</th>
            <th>Put Price</th>
            <th>Delta</th>
            <th>Gamma</th>
            <th>Theta</th>
            <th>Vega</th>
          </tr>
        </thead>

        <tbody>
          {options.map((option) => {
            const callKey =
              `${option.strike}-call`;

            const putKey =
              `${option.strike}-put`;

            const callDirection =
              priceChanges[callKey];

            const putDirection =
              priceChanges[putKey];

            return (
              <tr key={option.strike}>
                <td>
                  {option.strike.toFixed(0)}
                </td>

                <td
                  className={
                    callDirection
                      ? `price-${callDirection}`
                      : ""
                  }
                >
                  {option.call.toFixed(2)}

                  {callDirection === "up" &&
                    " ↑"}

                  {callDirection === "down" &&
                    " ↓"}
                </td>

                <td
                  className={
                    putDirection
                      ? `price-${putDirection}`
                      : ""
                  }
                >
                  {option.put.toFixed(2)}

                  {putDirection === "up" &&
                    " ↑"}

                  {putDirection === "down" &&
                    " ↓"}
                </td>

                <td>
                  {option.delta.toFixed(4)}
                </td>

                <td>
                  {option.gamma.toFixed(6)}
                </td>

                <td>
                  {option.theta.toFixed(4)}
                </td>

                <td>
                  {option.vega.toFixed(4)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default PricingTable;