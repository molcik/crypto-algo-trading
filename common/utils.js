const CoinbasePro = require('coinbase-pro');
const publicClient = new CoinbasePro.PublicClient();

const downloadData = async (start, end, timeframe, productId) => {
    /**
     * time bucket start time
     * low lowest price during the bucket interval
     * high highest price during the bucket interval
     * open opening price (first trade) in the bucket interval
     * close closing price (last trade) in the bucket interval
     * volume volume of trading activity during the bucket interval
     * [0,              1,      2,          3,          4,          5]
     * [time,           low,    high,       open        close ,     volume]
     * [ 1565654400,    10746,  11438.39,   11389.25,   10854.92,   12500.34295603 ],
     */
    start = new Date(start).getTime()
    end = new Date(end).getTime()
    let tempEnd;
    let data = []

    do {
        tempEnd = start + 300 * timeframe * 1000
        tempEnd = tempEnd > end ? tempEnd = end : tempEnd = tempEnd
        console.log(`
    Downloading data 
        from: ${new Date(start).toISOString()} 
        to ${new Date(tempEnd).toISOString()}`)
        let newData = await publicClient.getProductHistoricRates(productId,
            {
                start: new Date(start).toISOString(),
                end: new Date(tempEnd).toISOString(),
                granularity: timeframe
            },
        );
        await new Promise(resolve => setTimeout(resolve, 3000));

        start = tempEnd
        //We get the data from oldest to newest so we have to reverse them
        data.push(...newData.reverse())
    } while (tempEnd < end)

    console.log(`
    Downloaded data: 
        first: ${data[0]}
        last:  ${data[data.length - 1]}`)
    return data
}

module.exports = { downloadData }
