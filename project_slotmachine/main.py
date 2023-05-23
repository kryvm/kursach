from fastapi import FastAPI
from slotmachine import SlotMachine
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Bet(BaseModel):
    bet: int = 1
    possibilities: dict
    wincoef: dict
    drums: int
    rows: int
@app.post("/roll")
def root(params: Bet):
    slot = SlotMachine(params.drums, params.rows, params.possibilities, params.wincoef)
    result = slot.roll()
    win = slot.calculateWinning(result,params.bet)
    return {"bet": params.bet, "win": win, "result": result}
@app.post("/calculatePayback")
def root(params: Bet):
    slot = SlotMachine(params.drums, params.rows, params.possibilities, params.wincoef)
    return {"bet": params.bet, "predictedPayback": slot.countMonteCarlo()}

