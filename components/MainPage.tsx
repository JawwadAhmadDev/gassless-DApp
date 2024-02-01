import GaslessDeposit from "./Deposit/Deposit";
import GaslessTransfer from "./Transfer/Transfer";
import GaslessWithdraw from "./Withdraw/Withdraw";

 
export default function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 mt-5">
      {/* <h1 className="text-6xl font-bold mb-24 text-slate-300 italic">uToken Gassless Transactions</h1> */}
      <div className="mb-9 w-full">
        <GaslessDeposit />
      </div>
      <div className="flex flex-row justify-center items-center gap-x-1 w-full">
        <GaslessTransfer />
        <GaslessWithdraw />
      </div>
    </div>
  )
}
