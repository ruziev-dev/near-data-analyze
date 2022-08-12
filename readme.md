Created by Timur Ruziev (participant of [**stakewars-iii**](https://github.com/near/stakewars-iii))

You can see my challenge report here: https://github.com/ruziev-dev/near-stakewars-iii

# Frontend

I have put source code here: https://github.com/ruziev-dev/near-data-analyze-frontend.git

Deployed version on GitHub Pages: **TODO: add gh-pages link!**

# Backend

## Installation

1. Clone repository

   ```bash
   git clone https://github.com/ruziev-dev/near-data-analyze.git
   ```

2. Copy example .env

   ```bash
   cp example.env .env
   ```

3. Change it if you

   ```bash
   nano .env
   ```

   Default settings here

   ```bash
   NETWORK=mainnet
   NODE_IP=https://rpc.mainnet.near.org
   ARCHIVAL_NODE=https://archival-rpc.mainnet.near.org
   GRAB_INTERVAL=60
   PORT=3000
   ```

4. Install dependencies

   ```bash
   npm install
   ```

5. Run backend

   ```bash
   npm run start
   ```

If actions have been completed succesfull you will see process of accumulating data.

```js
> { epoch_length: 43200 }
> { blockHeight: 71596289, iterations: 1 }
> { blockHeight: 71553089, iterations: 2 }
> { blockHeight: 71509889, iterations: 3 }
```

It will be filled in `data.sqlite` file.

Logs will be written on `logs` folder

## Endpoints

`http://localhost:3000/` (or your another adress)

- Common request to root endpoint

```json
"network": "mainnet",
"epochs": [
	{
        "ID": "GAxfxJMfqpUUu4uJEpJ2xGvs3DSZmUN3spZzqAJhEg1H",
        "TIMESTAMP": 1660000010826932500,
        "HEIGHT": 1430,
        "START_BLOCK": 71596290,
        "LAST_BLOCK": 71639489,
        "VALIDATORS": 100,
        "SEAT_PRICE": 192507,
        "AVERAGE_STAKE": 4245106.75,
        "MEDIAN_STAKE": 3912213.5,
        "GAS_PRICE": 100000000,
        "KICKED_OUT": 2,
	}
],
"pools": [
	{
        "POOLNAME": "01node.poolv1.near"
    },
	{
        "POOLNAME": "aurora.pool.near"
    }
]
```

- Poolid History Request `/poolid/:poolId`

example http://localhost:3000/poolid/aurora.pool.near

```json
"name": "aurora.pool.near",
"history": [
	{
        "TIMESTAMP": 1652456141405038300,
        "STAKE": 23450228,
        "EXPECTED_BLOCKS": 2192,
        "PRODUCED_BLOCKS": 2192,
        "EXPECTED_CHUNKS": 8760,
        "PRODUCED_CHUNKS": 8760,
        "KICKEDOUT": 0,
        "ID": "EmH4KygS1YxpDgQEcKsThXdYYFahgg7KpykM6cuWybS5",
        "HEIGHT": 1289
    },
    {
        "TIMESTAMP": 1652509034760126500,
        "STAKE": 23430992,
        "EXPECTED_BLOCKS": 2160,
        "PRODUCED_BLOCKS": 2159,
        "EXPECTED_CHUNKS": 8640,
        "PRODUCED_CHUNKS": 8640,
        "KICKEDOUT": 0,
        "ID": "Dj2DQkDDt3KUnBYMdv8idXgPTLNZucwReEJ1a6n3gFKM",
        "HEIGHT": 1290
    },
]
```

- Epoch Validators Request `/epoch/:epochId`

example http://localhost:3000/epoch/EmH4KygS1YxpDgQEcKsThXdYYFahgg7KpykM6cuWybS5

```json
"epoch": "EmH4KygS1YxpDgQEcKsThXdYYFahgg7KpykM6cuWybS5",
"validators": [
    {
        "POOLNAME": "01node.poolv1.near",
        "EPOCH_ID": "EmH4KygS1YxpDgQEcKsThXdYYFahgg7KpykM6cuWybS5",
        "EXPECTED_BLOCKS": 170,
        "PRODUCED_BLOCKS": 170,
        "EXPECTED_CHUNKS": 680,
        "PRODUCED_CHUNKS": 680,
        "STAKE": 1754066,
        "KICKEDOUT": 0
    },
    {
        "POOLNAME": "08investinwomen_runbybisontrails.poolv1.near",
        "EPOCH_ID": "EmH4KygS1YxpDgQEcKsThXdYYFahgg7KpykM6cuWybS5",
        "EXPECTED_BLOCKS": 537,
        "PRODUCED_BLOCKS": 537,
        "EXPECTED_CHUNKS": 2148,
        "PRODUCED_CHUNKS": 2148,
        "STAKE": 5612903,
        "KICKEDOUT": 0
    }
]
```
