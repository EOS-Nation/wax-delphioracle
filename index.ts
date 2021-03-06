import { CronJob } from "cron"
import { get_ticker } from "./plugins/bittrex"
import { Quote, write } from "./plugins/delphioracle"
import { transact } from "./src/utils";
import { api, ACCOUNT, AUTHORIZATION } from "./src/config";

new CronJob("* * * * *", async () => {
    const btc = await get_ticker("WAXP-BTC");
    const usd = await get_ticker("WAXP-USD");

    const quotes: Quote[] = [
        { pair: "waxpbtc", value: to_uint(btc.lastTradeRate, 8)},
        { pair: "waxpusd", value: to_uint(usd.lastTradeRate, 4)}
    ]
    await transact( api, [ write( ACCOUNT, quotes, [ AUTHORIZATION ] )]);

}, null, true).fireOnTick();


function to_uint( num: string | number, exp: number ) {
    return Number((Number(num) * 10 ** exp).toFixed(0));
}