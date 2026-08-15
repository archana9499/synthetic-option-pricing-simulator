import asyncio

from fastapi import (
    FastAPI,
    WebSocket,
    WebSocketDisconnect,
)

from simulator import Simulator


app = FastAPI()

simulator = Simulator()

simulation_running = False
update_frequency = 1.0


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
):
    global simulation_running
    global update_frequency

    await websocket.accept()

    print("WebSocket client connected.")

    async def send_pricing_updates():
        while True:

            if simulation_running:
                pricing_data = (
                    simulator.generate_pricing_data()
                )

                await websocket.send_json(
                    pricing_data
                )

            await asyncio.sleep(
                update_frequency
            )

    async def receive_commands():
        global simulation_running
        global update_frequency

        while True:

            message = (
                await websocket.receive_json()
            )

            command = message.get("type")

            if command == "start":
                simulation_running = True
                simulator.reset()

            elif command == "stop":
                simulation_running = False

            elif command == "reset":
                simulator.reset()

            elif command == "set_frequency":
                value = message.get("value")

                if value in [0.1, 0.5, 1.0]:
                    update_frequency = value

            elif command == "set_starting_price":
                value = message.get("value")

                if (
                    isinstance(
                        value,
                        (int, float),
                    )
                    and value > 0
                ):
                    simulator.set_starting_price(
                        float(value)
                    )

            elif command == "set_volatility":
                value = message.get("value")

                if isinstance(
                    value,
                    (int, float),
                ):
                    simulator.set_volatility(
                        float(value)
                    )

    try:
        await asyncio.gather(
            send_pricing_updates(),
            receive_commands(),
        )

    except WebSocketDisconnect:
        print(
            "WebSocket client disconnected."
        )