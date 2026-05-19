export interface paths {
    "/key/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get API key info
         * @description Returns API key information:
         *     * Name of the API key plan
         *     * When the plan started
         *     * A flag indicating if the plan is active
         *     * Link to the API user portal
         *     * Monthly usage
         *
         *     **Available on the following API plans:**
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getKeyInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/global": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get market overview data
         * @description Returns current cryptocurrencies market overview metrics, such as:
         *     * Global market capitalization
         *     * Total 24h volume of all cryptocurrencies
         *     * Number of active cryptocurrencies on coinpaprika.com
         *     * ATH of 24h volume and market capitalization
         *     * and more
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 5 minute.
         */
        get: operations["getGlobal"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List coins
         * @description Returns basic information about cryptocurrencies on coinpaprika.com:
         *     * identity (`id`, `name`, `symbol`)
         *     * ranking (`rank`)
         *     * activity status (`is_active`)
         *     * type of cryptocurrency (`type`) - `coin` or `token`
         *     * information whether the currency is new (`is_new`) - true if the currency was added within the last 5 days
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getCoins"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/{coin_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get coin by ID
         * @description Returns detailed descriptive information about a single coin, without price or volume data. For price data, check the [/tickers](#operation/getTickers) and [/tickers/{coin_id}](#operation/getTickersById) endpoints.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getCoinById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/mappings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * API ID mappings
         * @description The API ID Mappings endpoint allows you to map IDs from other cryptocurrency API providers to Coinpaprika API IDs. This is especially useful when you have provider-specific IDs and want to interact with the Coinpaprika API using its own standardized IDs. In addition to Coinpaprika's and other providers internal ID system, this endpoint also supports mapping [ISIN(International Securities Identification Number)](https://www.isin.org/isin-for-cryptocurrency/) and [DTI (Digital Token Identifier)](https://www.iso.org/obp/ui/en/#iso:std:iso:24165:-2:ed-1:v1:en) IDs.
         *
         *     **Use Cases:**
         *       - Map your existing provider IDs (including ISIN and DTI) to Coinpaprika IDs
         *       - Retrieve other provider IDs (and ISIN, DTI) corresponding to a given Coinpaprika ID
         *       - Easily integrate and standardize data across different platforms with varying ID systems
         *
         *     This flexibility enables seamless integration across different crypto data sources and allows you to work with a variety of ID formats within the Coinpaprika ecosystem.
         *
         *     **Available mapping providers**
         *       - Coinpaprika
         *       - Coinmarketcap
         *       - Coingecko
         *       - Cryptocompare
         *       - [ISIN](https://www.isin.org/isin-for-cryptocurrency/)
         *       - [DTI](https://www.iso.org/obp/ui/en/#iso:std:iso:24165:-2:ed-1:v1:en)
         *
         *     **Available on the following API plans:**
         *     - Business
         *     - Enterprise
         *
         *     **Examples:**
         *
         *     Use a single query parameter to get mappings for a specific Coinpaprika, Coinmarketcap, Coingecko, Cryptocompare, ISIN, or DTI ID. The response will include all available mappings for the specified ID.
         *
         *     ```shell
         *     # Get mappings for a specific Coinpaprika ID
         *     curl --request GET \
         *         --url 'https://api-pro.coinpaprika.com/v1/coins/mappings?coinpaprika=btc-bitcoin' \
         *         --header 'Authorization: <your-api-key>'
         *
         *     # Get mappings for a specific Coinmarketcap ID
         *     curl --request GET \
         *         --url 'https://api-pro.coinpaprika.com/v1/coins/mappings?coinmarketcap=1' \
         *         --header 'Authorization: <your-api-key>'\
         *
         *     # Get mappings for a specific Coingecko ID
         *     curl --request GET \
         *         --url 'https://api-pro.coinpaprika.com/v1/coins/mappings?coingecko=bitcoin' \
         *         --header 'Authorization: <your-api-key>'
         *
         *     # Get mappings for a specific Cryptocompare ID
         *     curl --request GET \
         *         --url 'https://api-pro.coinpaprika.com/v1/coins/mappings?cryptocompare=1' \
         *         --header 'Authorization: <your-api-key>'
         *
         *     # Get mappings for a specific ISIN ID
         *     curl --request GET \
         *         --url 'https://api-pro.coinpaprika.com/v1/coins/mappings?isin=XTV15WLZJMF0' \
         *         --header 'Authorization: <your-api-key>'
         *
         *     # Get mappings for a specific DTI ID
         *     curl --request GET \
         *         --url 'https://api-pro.coinpaprika.com/v1/coins/mappings?dti=V15WLZJMF' \
         *         --header 'Authorization: <your-api-key>'
         *     ```
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getMappings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/{coin_id}/twitter": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Twitter timeline tweets for a coin (DEPRECATED)
         * @deprecated
         * @description **THIS ENDPOINT HAS BEEN DEPRECATED AND WILL BE REMOVED.**
         *     Please refer to our API documentation for alternatives.
         *
         *     ---
         *     *Original Description (for historical reference):*
         *     Returns the last 50 timeline tweets from the official Twitter profile for a given coin.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 5 minutes.
         */
        get: operations["getCoinTwitter"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/{coin_id}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get coin events by coin ID
         * @description Returns events for a given coin.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 5 minutes.
         */
        get: operations["getCoinEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/{coin_id}/exchanges": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get exchanges by coin ID
         * @description Returns exchanges where a given coin is traded.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getCoinExchanges"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/{coin_id}/markets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get markets by coin ID
         * @description Returns all available markets for a given coin.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getCoinMarkets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/{coin_id}/ohlcv/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get OHLC for the last full day
         * @description Returns Open/High/Low/Close values with volume and market capitalization for the last full day.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 day.
         */
        get: operations["getCoinOHLCVLatest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/{coin_id}/ohlcv/historical": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical OHLC
         * @description Returns Open/High/Low/Close values with volume and market capitalization for any date range. If the `end` date is the current day, data can change with every request until actual close of the day at 23:59:59"
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Maximum time range of data available to fetch depending on the plan:**
         *
         *     | Plan       | Time range                         |
         *     |------------|-------------------------------------|
         *     | Free       | Last 24 hours |
         *     | Starter    | Last 30 days |
         *     | Pro        | Last 90 days |
         *     | Business   | Last 365 days |
         *     | Enterprise | No limits |
         *
         *     **The default interval of returned data for OHLCV is 24 hours:**
         *     ```
         *     [
         *       {
         *         "time_open": "2020-01-01T00:00:00Z",
         *         "time_close": "2020-01-01T23:59:59Z",
         *         "open": ...,
         *         "high": ...,
         *         "low": ...,
         *         "close": ...,
         *         "volume": ...,
         *         "market_cap": ...
         *       }
         *       ...
         *     ]
         *     ```
         *
         *     **However, depending on your API plan, you can set a smaller interval by using the query parameter `interval`:**
         *
         *     | Plan       | `interval` parameter value          |
         *     |------------|-------------------------------------|
         *     | Free       | `24h` |
         *     | Starter    | `24h` |
         *     | Pro        | `24h` |
         *     | Business   | `1h`, `6h`, `12h`, `24h` |
         *     | Enterprise | `5m`, `15m`, `30m`, `1h`, `6h`, `12h`, `24h` |
         *
         *     **Update interval:** Every 5 minute.
         */
        get: operations["getCoinOHLCVHistorical"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins/{coin_id}/ohlcv/today": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get today OHLC
         * @description Returns Open/High/Low/Close values with volume and market capitalization for the current day. Data can change every each request until actual close of the day at 23:59:59.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 5 minute.
         */
        get: operations["getCoinOHLCVToday"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/people/{person_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get person by ID
         * @description Returns information about a person with the specified ID, related to the cryptocurrency market. Using this endpoint you can get a description of the person, social media links, number of teams she or he is involved in and the positions in those teams.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 hour.
         */
        get: operations["getPeopleById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List tags
         * @description Returns basic information about cryptocurrencies tags (categories):
         *     * name
         *     * description
         *     * type of tag: `technical` or `functional`
         *     * number of coins with the tag
         *     * number of ICOs with the tag
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 hour.
         */
        get: operations["getTags"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/{tag_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get tag by ID
         * @description Returns information about a given cryptocurrency tag:
         *     * name
         *     * description
         *     * type of tag: `technical` or `functional`
         *     * number of coins with the tag
         *     * number of ICOs with the tag
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 hour.
         */
        get: operations["getTagById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get tickers for all active coins
         * @description Returns price data of all active cryptocurrencies on coinpaprika.com:
         *     * identity (`id`, `name`, `symbol`)
         *     * ranking (`rank`)
         *     * supplies (`circulating_supply`, `total_supply`, `max_supply`)
         *     * [beta coefficient](https://www.investopedia.com/terms/b/beta.asp) (`beta_value`)
         *     * price data in a given currency (price, volumes, market cap, price changes, ath)
         *
         *     **Available on the following API plans:**
         *     - Free - there is no `circulating supply` field in the Free plan. If you need this field, use another API plan.
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Maximum number of assets returned depending on the selected API plan:**
         *
         *     | Plan       | Assets                         |
         *     |------------|-------------------------------------|
         *     | Free       | 2000 |
         *     | Starter    | No limits |
         *     | Pro        | No limits |
         *     | Business   | No limits |
         *     | Enterprise | No limits |
         *
         *     **Update interval:**
         *     - 60 seconds for Starter, Pro, Business, Enterprise plans
         *     - On average 5 minutes for Free
         */
        get: operations["getTickers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickers/{coin_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get ticker for a specific coin
         * @description Returns price data of a single cryptocurrency on coinpaprika.com:
         *     * identity (`id`, `name`, `symbol`)
         *     * ranking (`rank`)
         *     * supplies (`circulating_supply`, `total_supply`, `max_supply`)
         *     * [beta coefficient](https://www.investopedia.com/terms/b/beta.asp) (`beta_value`)
         *     * price data in a given currency (price, volumes, market cap, price changes, ath)
         *
         *     **Available on the following API plans:**
         *     - Free - there is no `circulating supply` field in the Free plan. If you need this field, use another API plan.
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:**
         *     - 60 seconds for Starter, Pro, Business, Enterprise plans
         *     - On average 5 minutes for Free
         */
        get: operations["getTickersById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickers/{coin_id}/historical": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical ticks for a specific coin
         * @description Returns historical values of `price`, `volume_24h`, `market_cap` for a given cryptocurrency on coinpaprika.com:
         *
         *     **Available history range depending on the selected API plan:**
         *
         *     | Interval | `interval` param values | Free | Starter | Pro | Business | Enterprise |
         *     |---|---|---|---|---|---|---|
         *     | Daily | `24h`, `1d`, `7d`, `14d`, `30d`, `90d`, `365d` | last 1 year | last 5 years | unlimited | unlimited | unlimited |
         *     | Hourly | `1h`, `2h`, `3h`, `6h`, `12h` | last 1 day | last 30 days | last 90 days | last 365 days | unlimited |
         *     | 5-minute | `5m`, `10m`, `15m`, `30m`, `45m` | none | last 7 days | last 30 days | last 365 days | unlimited |
         *
         *     **Update interval:** Every 5 minutes.
         */
        get: operations["getTickersHistoricalById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exchanges": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List exchanges
         * @description Returns basic information about exchanges on coinpaprika.com:
         *     * identity (`id`, `name`)
         *     * ranking
         *     * activity status
         *     * number of currencies, markets
         *     * volumes
         *     * etc.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getExchanges"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exchanges/{exchange_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get exchange by ID
         * @description Returns basic information about a given exchange on coinpaprika.com:
         *     * identity (`id`, `name`)
         *     * ranking
         *     * activity status
         *     * number of currencies, markets
         *     * volumes
         *     * etc.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getExchangeByID"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exchanges/{exchange_id}/markets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List an exchange markets
         * @description Returns list of all available markets on a given exchange on coinpaprika.com:
         *     * base, quote coin names/symbols, market url
         *     * market type
         *     * activity and outlier status
         *     * price and volume
         *     * etc.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getExchangeMarkets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List contracts platforms
         * @description Returns all available contract platforms on coinpaprika.com.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getPlatforms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts/{platform_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all contract addressess for a given platform
         * @description Returns all available contracts for a given platform on coinpaprika.com.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getContracts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts/{platform_id}/{contract_address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Redirect to Ticker by contract address
         * @description Returns [ticker](#operation/getTickersById) data for a contract with a given address.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 5 minute.
         */
        get: operations["getTicker"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts/{platform_id}/{contract_address}/historical": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Redirect to historical ticks by contract address
         * @description Returns [historical ticks](#operation/getTickersHistoricalById) for a contract with a given address.
         *
         *     **Check [historical ticks endpoint documentation](#operation/getTickersHistoricalById) to find out about the limitations for each API plan.**
         *
         *     **Update interval:** Every 5 minute.
         */
        get: operations["getHistoricalTicker"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/changelog/ids": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get id changelog for all coins
         * @description Returns coin id changes made by coinpaprika.com moderators:
         *     * `currency_id` - current id of a coin
         *     * `old_id` - old coin id that has been replaced with a new one
         *     * `new_id` - new coin id that replaced the old one
         *     * `changed_at` - date of the change
         *
         *     **Available on the following API plans:**
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["getChangelogIDs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search
         * @description Returns currencies, exchanges, icos, people, tags on coinpaprika.com for a given search query.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/price-converter": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Price converter
         * @description Converts a set amount of base currency to quote currency.
         *
         *     **Available on the following API plans:**
         *     - Free
         *     - Starter
         *     - Pro
         *     - Business
         *     - Enterprise
         *
         *     **Update interval:** Every 1 minute.
         */
        get: operations["priceConverter"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ticker": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get ticker information for all coins (DEPRECATED)
         * @deprecated
         * @description **THIS ENDPOINT HAS BEEN DEPRECATED AND WILL BE REMOVED.**
         *     Please use the new `/tickers` endpoint instead.
         */
        get: operations["getTickers__ticker"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ticker/{coin_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get ticker by ID (DEPRECATED)
         * @deprecated
         * @description **THIS ENDPOINT HAS BEEN DEPRECATED AND WILL BE REMOVED.**
         *     Please use the new `/tickers/{coin-id}` endpoint instead.
         */
        get: operations["getTickerById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Requests made and left stats */
        current_month: {
            /**
             * @description Number of requests made in the current month. If a plan has no limit on the number of requests, e.g., `Enterprise` plan, then the value of `requests_made` is -1
             * @example 18
             */
            requests_made?: number;
            /**
             * @description Number of requests left in the  current month. If a plan has no limit on the number of requests, e.g., `Enterprise` plan, then the value of `requests_left` is -1
             * @example 499982
             */
            requests_left?: number;
        };
        /** @description Monthly usage for the API key */
        usage: {
            /**
             * @description `limited plan` if the number of requests is limited in the current plan or `unlimited plan` if there is no limit on the number of requests
             * @example limited plan
             */
            message?: string;
            current_month?: components["schemas"]["current_month"];
        };
        info: {
            /**
             * @description Name of the API plan
             * @example pro
             */
            plan?: string;
            /**
             * @description A date when the plan started in RFC3999 (ISO-8601) format
             * @example 2022-09-16T10:17:24Z
             */
            plan_started_at?: string;
            /**
             * @description Status of the plan. There are 3 possible statuses: `active` - the subscription is active; `past_due` - the subscription payment failed. If payment is not made within 7 days, then the subscription will expire; `inactive` - the subscription is inactive.
             * @example active
             */
            plan_status?: string;
            /**
             * @description API Customer Portal URL
             * @example https://coinpaprika.com/api/panel
             */
            portal_url?: string;
            usage?: components["schemas"]["usage"];
        };
        tooManyRequestsError: {
            /**
             * @description Error description
             * @example you have reached maximum request limit
             */
            error?: string;
        };
        global: {
            /**
             * @description Total market capitalization - sum of all cryptocurrency market capitalizations in USD
             * @example 430252937008
             */
            market_cap_usd?: number;
            /**
             * @description Total 24h volume - sum of all cryptocurrency volumes in USD
             * @example 430252937008
             */
            volume_24h_usd?: number;
            /**
             * @description Bitcoin market capitalization as a percentage of total market capitalization
             * @example 36.67
             */
            bitcoin_dominance_percentage?: number;
            /**
             * @description This is number of active cryptocurrencies on our site (active in this case means that we have up-to-date price data for a coin). Total number of our cryptocurrencies is higher and may be obtained via counting elements in /coins endpoint.
             * @example 1587
             */
            cryptocurrencies_number?: number;
            /**
             * @description ATH (All Time High) value of market capitalization - the highest historical value of marketcap
             * @example 835692000000
             */
            market_cap_ath_value?: number;
            /**
             * @description ATH (All Time High) date of market capitalization
             * @example 2018-01-07T11:17:00Z
             */
            market_cap_ath_date?: string;
            /**
             * @description ATH (All Time High) value of the 24h volume - the highest historical value of 24h volume
             * @example 71990500000
             */
            volume_24h_ath_value?: number;
            /**
             * @description ATH (All Time High) date of volume 24h
             * @example 2018-01-04T17:17:00Z
             */
            volume_24h_ath_date?: string;
            /**
             * @description Percentage change in the market capitalization over the last 24h
             * @example 1.98
             */
            market_cap_change_24h?: number;
            /**
             * @description Percentage change in the volume 24h over the last 24h
             * @example 1.98
             */
            volume_24h_change_24h?: number;
            /**
             * @description Timestamp of the last data update
             * @example 1525089441
             */
            last_updated?: number;
        };
        currency: {
            /**
             * @description ID of coin on coinpaprika.com
             * @example btc-bitcoin
             */
            id?: string;
            /**
             * @description Name of the cryptocurrency
             * @example Bitcoin
             */
            name?: string;
            /**
             * @description Symbol of the cryptocurrency
             * @example BTC
             */
            symbol?: string;
            /**
             * @description Current ranking of the cryptocurrency. If `is_active` is false the `rank` is 0
             * @example 1
             */
            rank?: number;
            /**
             * @description Flag indicating if the currency was added within the last 5 days
             * @example false
             */
            is_new?: boolean;
            /**
             * @description Flag indicating if the currency is active, which means that we can calculate the current price and volume
             * @example true
             */
            is_active?: boolean;
            /**
             * @description Type of the cryptocurrency. Currently supported values are `coin` and `token`
             * @example coin
             */
            type?: string;
        };
        coin_parent: {
            /** @example eth-ethereum */
            id?: string;
            /** @example Ethereum */
            name?: string;
            /** @example ETH */
            symbol?: string;
        };
        tag_simplified: {
            /**
             * @description ID of the tag
             * @example blockchain-service
             */
            id?: string;
            /**
             * @description Name of the tag
             * @example Blockchain Service
             */
            name?: string;
            /**
             * @description Number of coins with this tag
             * @example 160
             */
            coin_counter?: number;
            /**
             * @description Number of ico projects with this tag
             * @example 80
             */
            ico_counter?: number;
        };
        person_with_position: {
            /** @example vitalik-buterin */
            id?: string;
            /** @example Vitalik Buterin */
            name?: string;
            /** @example Author */
            position?: string;
        };
        contract: {
            /** @description The contract identifier, which is usually its address */
            contract: string;
            /** @description ID of the contract platform. For Ethereum contracts it is `eth-ethereum`, for Tron `trx-tron`, etc. */
            platform: string;
            /** @description Type of the contract. Currently supported values are: `ERC20`, `BEP2`, `TRC10`, `TRC20`, `Stellar Asset`, `Other` */
            type: string;
        };
        coin_links: {
            /**
             * @description List of links to blockchain explorers, if any
             * @example [
             *       "http://blockchain.com/explorer",
             *       "https://blockchair.com/bitcoin/blocks",
             *       "https://blockexplorer.com/",
             *       "https://live.blockcypher.com/btc/"
             *     ]
             */
            explorer?: string[] | null;
            /**
             * @description List of links to Facebook pages of the cryptocurrency, if any
             * @example [
             *       "https://www.facebook.com/bitcoins/"
             *     ]
             */
            facebook?: string[] | null;
            /**
             * @description List of links to Reddit communities and profiles, if any
             * @example [
             *       "https://www.reddit.com/r/bitcoin"
             *     ]
             */
            reddit?: string[] | null;
            /**
             * @description List of links to source code repositories, if any
             * @example [
             *       "https://github.com/bitcoin/bitcoin"
             *     ]
             */
            source_code?: string[] | null;
            /**
             * @description List of the cryptocurrency websites, if any
             * @example [
             *       "https://bitcoin.org/"
             *     ]
             */
            website?: string[] | null;
            /**
             * @description List of links to Youtube channels of the cryptocurrency, if any
             * @example [
             *       "https://www.youtube.com/watch?v=Um63OQz3bjo"
             *     ]
             */
            youtube?: string[] | null;
            /**
             * @description List of links to Medium profiles of the cryptocurrency, if any
             * @example null
             */
            medium?: string[] | null;
        };
        link_extended: {
            /** @description The link URL */
            url: string;
            /** @description Type of the link: `website`, `reddit`, `source_code`, etc. */
            type: string;
            /** @description An object containing the link stats like `subscribers` (for reddit), `followers` (for twitter), `members` (for telegram), `stars`, `contributors` (for source code) */
            stats?: {
                [key: string]: number;
            };
        };
        whitepaper: {
            /**
             * @description The whitepaper URL
             * @example https://static.coinpaprika.com/storage/cdn/whitepapers/215.pdf
             */
            link?: string;
            /**
             * @description Link to the whitepaper thumbnail
             * @example https://static.coinpaprika.com/storage/cdn/whitepapers/217.jpg
             */
            thumbnail?: string;
        };
        coin_extended: {
            /**
             * @description ID of coin on coinpaprika.com
             * @example btc-bitcoin
             */
            id?: string;
            /**
             * @description Name of the cryptocurrency
             * @example Bitcoin
             */
            name?: string;
            /**
             * @description Symbol of the cryptocurrency
             * @example BTC
             */
            symbol?: string;
            /**
             * @description This field is deprecated. Use `contracts` field instead
             * @example {
             *       "id": "eth-ethereum",
             *       "name": "Ethereum",
             *       "symbol": "ETH"
             *     }
             */
            parent?: components["schemas"]["coin_parent"];
            /**
             * @description Current coin ranking position on coinpaprika.com
             * @example 1
             */
            rank?: number;
            /**
             * @description Flag indicating if the currency was added within the last 5 days
             * @example false
             */
            is_new?: boolean;
            /**
             * @description Flag indicating if the currency is active, which means that we can calculate the current price and volume
             * @example true
             */
            is_active?: boolean;
            /**
             * @description Type of the cryptocurrency. Currently supported values are `coin` and `token`
             * @example coin
             */
            type?: string;
            /**
             * @description Logo image URL
             * @example https://static.coinpaprika.com/coin/bnb-binance-coin/logo.png
             */
            logo?: string;
            /** @description The array of tags to which this coin was assigned on coinpaprika.com */
            tags?: components["schemas"]["tag_simplified"][];
            /** @description The cryptocurrency founding and/or developing team */
            team?: components["schemas"]["person_with_position"][];
            /**
             * @description Text description of the cryptocurrency
             * @example Bitcoin is a cryptocurrency and worldwide payment system. It is the first decentralized digital currency, as the system works without a central bank or single administrator.
             */
            description?: string | null;
            /** @description An important message about current status of the cryptocurrency */
            message?: string;
            /**
             * @description Set to true if the cryptocurrency is Open Source project
             * @example true
             */
            open_source?: boolean;
            /**
             * @description Set to true if the cryptocurrency is supported by any hardware wallet
             * @example true
             */
            hardware_wallet?: boolean;
            /**
             * @description Launch date of the cryptocurrency
             * @example 2009-01-03T00:00:00Z
             */
            started_at?: string | null;
            /**
             * @description Development status of the cryptocurrency - if it is a working project, beta version, just an idea, etc.
             * @example Working product
             */
            development_status?: string | null;
            /**
             * @description Cryptocurrency proof type: Proof of Work, Proof of Stake, etc.
             * @example Proof of work
             */
            proof_type?: string | null;
            /**
             * @description The cryptocurrency organization structure: centralized, decentralized, hierarchical, flat, etc.
             * @example Decentralized
             */
            org_structure?: string | null;
            /**
             * @description Name of the hash algorithm used by the cryptocurrency
             * @example SHA256
             */
            hash_algorithm?: string | null;
            /** @description This field is deprecated. Use `contracts` field instead */
            contract?: string | null;
            /** @description This field is deprecated. Use `contracts` field instead */
            platform?: string | null;
            contracts?: components["schemas"]["contract"][];
            links?: components["schemas"]["coin_links"];
            /**
             * @description Contains all links of the `{coin_id}` coin together with statistics for some of them, e.g. number of twitter followers, reddit subscribers, telegram members or github repository stars and contributors
             * @example [
             *       {
             *         "url": "http://blockchain.com/explorer",
             *         "type": "explorer"
             *       },
             *       {
             *         "url": "https://www.reddit.com/r/bitcoin",
             *         "type": "reddit",
             *         "stats": {
             *           "subscribers": 1009135
             *         }
             *       },
             *       {
             *         "url": "https://github.com/bitcoin/bitcoin",
             *         "type": "source_code",
             *         "stats": {
             *           "contributors": 730,
             *           "stars": 36613
             *         }
             *       },
             *       {
             *         "url": "https://bitcoin.org/",
             *         "type": "website"
             *       }
             *     ]
             */
            links_extended?: components["schemas"]["link_extended"][];
            whitepaper?: components["schemas"]["whitepaper"];
            /**
             * @description Date of the first available ticker data for the coin. RFC3999 (ISO-8601) format
             * @example 2018-10-03T11:48:19Z
             */
            first_data_at?: string;
            /**
             * @description Date of the last available ticker data for the coin. RFC3999 (ISO-8601) format
             * @example 2019-05-03T11:00:00
             */
            last_data_at?: string;
        };
        idNotFoundError: {
            /**
             * @description ID not found error message
             * @example id not found
             */
            error?: string;
        };
        api_mappings: {
            /**
             * @description ID of coin on coinpaprika.com
             * @example btc-bitcoin
             */
            coinpaprika?: string;
            /**
             * @description ID of coin on coinmarketcap.com
             * @example 1
             */
            coinmarketcap?: string;
            /**
             * @description ID of coin on coingecko.com
             * @example bitcoin
             */
            coingecko?: string;
            /**
             * @description ID of coin on cryptocompare.com
             * @example 1
             */
            cryptocompare?: string;
            /**
             * @description ISIN (International Securities Identification Number) of the coin
             * @example XTV15WLZJMF0
             */
            isin?: string;
            /**
             * @description Digital Token Identifier of the coin
             * @example V15WLZJMF
             */
            dti?: string;
            /**
             * @description Date of the last update of the mappings. RFC3999 (ISO-8601) format
             * @example 2024-12-12T13:13:28Z
             */
            updated_at?: string;
        };
        twitter: {
            /**
             * @description Publish date of the tweet. RFC3999 (ISO-8601) format
             * @example 2018-10-03T11:48:19Z
             */
            date?: string;
            /**
             * @description Twitter profile user name
             * @example bitcoincoreorg
             */
            user_name?: string;
            /** @description Twitter profile user image URL */
            user_image_link?: string;
            /**
             * @description Tweet content
             * @example Bitcoin Core 0.17.0 Released https://t.co/ciwCREngon
             */
            status?: string;
            /**
             * @description Flag indicating whether it is a retweet of someone else's tweet
             * @example false
             */
            is_retweet?: boolean;
            /** @description Number of retweets of this tweet */
            retweet_count?: number;
            /** @description Number of likes of this tweet */
            like_count?: number;
            /** @description Tweet URL */
            status_link?: string;
            /** @description Tweet ID */
            status_id?: string;
            /** @description Link to this tweet media: image, video, etc. */
            media_link?: string | null;
            /** @description Link to Youtube video shared in this tweet */
            youtube_link?: string | null;
        };
        event: {
            /** @example 17398-cme-april-first-trade */
            id?: string;
            /** @example 2018-04-02T00:00:00Z */
            date?: string;
            date_to?: string | null;
            /** @example CME: April First Trade */
            name?: string;
            /** @example First trade of Bitcoin futures contract for April 2018. */
            description?: string;
            /** @example false */
            is_conference?: boolean;
            /** @example http://www.cmegroup.com/trading/equity-index/us-index/bitcoin_product_calendar_futures.html */
            link?: string | null;
            /** @example https://static.coinpaprika.com/storage/cdn/event_images/16635.jpg */
            proof_image_link?: string | null;
        };
        exchange_fiat: {
            /** @example US Dollars */
            name?: string;
            /** @example USD */
            symbol?: string;
        };
        exchange_with_share: {
            /** @example binance */
            id?: string;
            /** @example Binance */
            name?: string;
            /**
             * @example [
             *       {
             *         "name": "US Dollars",
             *         "symbol": "USD"
             *       }
             *     ]
             */
            fiats?: components["schemas"]["exchange_fiat"][];
            /** @example 11.26 */
            adjusted_volume_24h_share?: number;
        };
        market_quote: {
            /** @example 4582.6967796728 */
            price?: number;
            /** @example 229658776.19514218 */
            volume_24h?: number;
        };
        market_quotes: {
            $KEY?: components["schemas"]["market_quote"];
        };
        coin_market: {
            /** @example binance */
            exchange_id?: string;
            /** @example Binance */
            exchange_name?: string;
            /** @example BTC/USDT */
            pair?: string;
            /** @example btc-bitcoin */
            base_currency_id?: string;
            /** @example Bitcoin */
            base_currency_name?: string;
            /** @example usdt-tether */
            quote_currency_id?: string;
            /** @example Tether */
            quote_currency_name?: string;
            /** @example https://www.binance.com/en/trade/BTC_USDT */
            market_url?: string;
            /** @example Spot */
            category?: string;
            /** @example Percentage */
            fee_type?: string;
            /** @example false */
            outlier?: boolean;
            /** @example 30.29 */
            adjusted_volume_24h_share?: number;
            quotes?: components["schemas"]["market_quotes"];
            /** @example 2018-11-14T07:20:41Z */
            last_updated?: string;
        };
        coins_ohlcv: {
            /**
             * @description RFC3999 (ISO-8601) format
             * @example 2018-03-01T00:00:00Z
             */
            time_open?: string;
            /**
             * @description RFC3999 (ISO-8601) format
             * @example 2018-03-01T23:59:59Z
             */
            time_close?: string;
            /** @example 856.012 */
            open?: number | null;
            /** @example 880.302 */
            high?: number | null;
            /** @example 851.92 */
            low?: number | null;
            /** @example 872.2 */
            close?: number | null;
            /** @example 1868520000 */
            volume?: number | null;
            /** @example 83808161204 */
            market_cap?: number | null;
        };
        link_with_followers: {
            /** @example http://example.com */
            url?: string;
            /** @example 6448 */
            followers?: number;
        };
        person_links: {
            github?: components["schemas"]["link_with_followers"][];
            linkedin?: components["schemas"]["link_with_followers"][];
            medium?: components["schemas"]["link_with_followers"][];
            twitter?: components["schemas"]["link_with_followers"][];
            additional?: components["schemas"]["link_with_followers"][];
        };
        coin_and_position: {
            /** @example eth-ethereum */
            coin_id?: string;
            /** @example Ethereum */
            coin_name?: string;
            /** @example Author */
            position?: string;
        };
        person_by_id: {
            /** @example vitalik-buterin */
            id?: string;
            /** @example Vitalik Buterin */
            name?: string;
            /** @example Vitalik is the creator of Ethereum. He first discovered blockchain and cryptocurrency technologies through Bitcoin in 2011, and was immediately excited by the technology and its potential. He cofounded Bitcoin Magazine in September 2011, and after two and a half years looking at what the existing blockchain technology and applications had to offer, wrote the Ethereum white paper in November 2013. He now leads Ethereum's research team, working on future versions of the Ethereum protocol. */
            description?: string;
            /**
             * @description Number of teams where person is a member
             * @example 5
             */
            teams_count?: number;
            links?: components["schemas"]["person_links"];
            positions?: components["schemas"]["coin_and_position"][];
        };
        tag: {
            /**
             * @description ID of the tag
             * @example blockchain-service
             */
            id?: string;
            /**
             * @description Name of the tag
             * @example Blockchain Service
             */
            name?: string;
            /**
             * @description Number of coins with this tag
             * @example 160
             */
            coin_counter?: number;
            /**
             * @description Number of ico projects with this tag
             * @example 80
             */
            ico_counter?: number;
            /** @example A solution for companies wanting to build, host and use their own blockchain apps, smart contracts and functions on the blockchain. */
            description?: string;
            /** @example functional */
            type?: string;
            /**
             * @example [
             *       "dcr-decred",
             *       "hc-hypercash",
             *       "nxs-nexus"
             *     ]
             */
            coins?: string[] | null;
            /**
             * @example [
             *       "kodakcoin-kodakone",
             *       "acad-academy"
             *     ]
             */
            icos?: string[] | null;
        };
        quote: {
            /** @example 6350.17460868 */
            price?: number;
            /** @example 3362993497 */
            volume_24h?: number;
            /** @example 0.4 */
            volume_24h_change_24h?: number;
            /** @example 110327457388 */
            market_cap?: number;
            /** @example 2.3 */
            market_cap_change_24h?: number;
            /** @example 0.1 */
            percent_change_1h?: number;
            /** @example 0.13 */
            percent_change_12h?: number;
            /** @example -0.26 */
            percent_change_24h?: number;
            /** @example -2.68 */
            percent_change_7d?: number;
            /** @example -7.16 */
            percent_change_30d?: number;
            /** @example -4.05 */
            percent_change_1y?: number;
            /** @example 20089 */
            ath_price?: number;
            /** @example 2017-12-17T12:19:00Z */
            ath_date?: string;
            /** @example -68.38 */
            percent_from_price_ath?: number;
        };
        /**
         * @example {
         *       "BTC": {
         *         "price": 1,
         *         "volume_24h": 1414951.9739396,
         *         "volume_24h_change_24h": -4.03,
         *         "market_cap": 17646575,
         *         "market_cap_change_24h": 0.01,
         *         "percent_change_15m": 0,
         *         "percent_change_30m": 0,
         *         "percent_change_1h": 0,
         *         "percent_change_6h": 0,
         *         "percent_change_12h": 0,
         *         "percent_change_24h": 0,
         *         "percent_change_7d": 0,
         *         "percent_change_30d": 0,
         *         "percent_change_1y": 0,
         *         "ath_price": null,
         *         "ath_date": null,
         *         "percent_from_price_ath": null
         *       },
         *       "USD": {
         *         "price": 5162.15941296,
         *         "volume_24h": 7304207651.1585,
         *         "volume_24h_change_24h": -2.5,
         *         "market_cap": 91094433242,
         *         "market_cap_change_24h": 1.6,
         *         "percent_change_15m": 0,
         *         "percent_change_30m": 0,
         *         "percent_change_1h": 0,
         *         "percent_change_6h": 0,
         *         "percent_change_12h": -0.09,
         *         "percent_change_24h": 1.59,
         *         "percent_change_7d": 0.28,
         *         "percent_change_30d": 27.39,
         *         "percent_change_1y": -37.99,
         *         "ath_price": 20089,
         *         "ath_date": "2017-12-17T12:19:00Z",
         *         "percent_from_price_ath": -74.3
         *       }
         *     }
         */
        quotes: {
            [key: string]: components["schemas"]["quote"];
        };
        /** @description Tick response. Missing values are returned as empty string */
        tick: {
            /** @example btc-bitcoin */
            id?: string;
            /** @example Bitcoin */
            name?: string;
            /** @example BTC */
            symbol?: string;
            /** @example 1 */
            rank?: number;
            /** @example 17007062 */
            circulating_supply?: number;
            /** @example 17007062 */
            total_supply?: number;
            /** @example 21000000 */
            max_supply?: number;
            /** @example 0.735327 */
            beta_value?: number;
            /** @example 2010-11-14T07:20:41Z */
            first_data_at?: string;
            /** @example 2018-11-14T07:20:41Z */
            last_updated?: string;
            quotes?: components["schemas"]["quotes"];
        };
        /** @description Historical tick response. */
        historical_tick: {
            /**
             * @description RFC3999 (ISO-8601) format
             * @example 2018-03-01T00:00:00Z
             */
            timestamp?: string;
            /** @example 855.53 */
            price?: number;
            /** @example 1968587956 */
            volume_24h?: number;
            /** @example 83761787514 */
            market_cap?: number;
        };
        /** @description Historical tick response. */
        historical_ticks: components["schemas"]["historical_tick"][];
        exchange_links: {
            /**
             * @example [
             *       "https://www.binance.com/"
             *     ]
             */
            website?: string[];
            /**
             * @example [
             *       "https://twitter.com/binance"
             *     ]
             */
            twitter?: string[];
        };
        exchanges_quote: {
            /** @example 794020873 */
            reported_volume_24h?: number;
            /** @example 794020873 */
            adjusted_volume_24h?: number;
            /**
             * @description 7d reported volume. This value is updated once per day at midnight (UTC). For example, at 2019-04-11 11:00 AM this value is the exchange volume between 2019-04-04 00:00:00 UTC and 2019-04-11 00:00:00 UTC
             * @example 153060819
             */
            reported_volume_7d?: number;
            /**
             * @description 7d adjusted volume updated once per day at midnight (UTC). See `reported_volume_7d` description for more details
             * @example 153060819
             */
            adjusted_volume_7d?: number;
            /**
             * @description 30d reported volume. This value is updated once per day at midnight (UTC). For example, at 2019-04-11 11:00 AM this value is the exchange volume between 2019-03-12 00:00:00 UTC and 2019-04-11 00:00:00 UTC
             * @example 301246828
             */
            reported_volume_30d?: number;
            /**
             * @description 30d adjusted volume updated once per day at midnight (UTC). See `reported_volume_30d` description for more details
             * @example 301246828
             */
            adjusted_volume_30d?: number;
        };
        exchanges_quotes: {
            $KEY?: components["schemas"]["exchanges_quote"];
        };
        exchange: {
            /** @example binance */
            id?: string;
            /** @example Binance */
            name?: string;
            /**
             * @description Exchange type classification. Determined by centralization status (cex, dex, other) and default market category (spot, perpetuals, otc).
             * @example [
             *       "cex",
             *       "spot"
             *     ]
             */
            type?: ("cex" | "dex" | "perpetuals" | "spot" | "otc" | "other")[];
            /** @example true */
            active?: boolean;
            /** @example true */
            website_status?: boolean;
            /** @example true */
            api_status?: boolean;
            /** @example Binance is a Malta-based cryptocurrency exchange founded in July 2017 */
            description?: string | null;
            /** @example Currently under maintenance */
            message?: string;
            links?: components["schemas"]["exchange_links"];
            /** @example true */
            markets_data_fetched?: boolean;
            /** @example 1 */
            adjusted_rank?: number;
            /** @example 3 */
            reported_rank?: number;
            /** @example 150 */
            currencies?: number;
            /** @example 385 */
            markets?: number;
            /**
             * @example [
             *       {
             *         "name": "US Dollars",
             *         "symbol": "USD"
             *       }
             *     ]
             */
            fiats?: components["schemas"]["exchange_fiat"][];
            quotes?: components["schemas"]["exchanges_quotes"];
            /** @example 2018-11-14T07:20:41Z */
            last_updated?: string;
        };
        market: {
            /** @example BTC/USDT */
            pair?: string;
            /** @example btc-bitcoin */
            base_currency_id?: string;
            /** @example Bitcoin */
            base_currency_name?: string;
            /** @example usdt-tether */
            quote_currency_id?: string;
            /** @example Tether */
            quote_currency_name?: string;
            /** @example https://www.binance.com/en/trade/BTC_USDT */
            market_url?: string;
            /** @example Spot */
            category?: string;
            /** @example Percentage */
            fee_type?: string;
            /** @example false */
            outlier?: boolean;
            /** @example 30.29 */
            reported_volume_24h_share?: number;
            quotes?: components["schemas"]["market_quotes"];
            /** @example 2018-11-14T07:20:41Z */
            last_updated?: string;
        };
        /** @example eth-ethereum */
        platform: string;
        contracts_contract: {
            /** @example 0xd26114cd6ee289accf82350c8d8487fedb8a0c07 */
            address?: string;
            /** @example omg-omisego */
            id?: string;
            /** @example ERC20 */
            type?: string;
        };
        /** @description ID changelog */
        id_changelog: {
            /** @example btc-bitcoin */
            currency_id?: string;
            /** @example btc-bitcoin123 */
            old_id?: string;
            /** @example btc-bitcoin456 */
            new_id?: string;
            /**
             * @description RFC3999 (ISO-8601) format
             * @example 2022-07-15T07:00:00Z
             */
            changed_at?: string;
        };
        /** @description IDs changelog response */
        ids_changelog: components["schemas"]["id_changelog"][];
        ico_project: {
            /** @example fil-filecoin-futures */
            id?: string;
            /** @example Filecoin */
            name?: string;
            /** @example FIL */
            symbol?: string;
            /** @example false */
            is_new?: boolean;
        };
        exchange_simplified: {
            /** @example binance */
            id?: string;
            /** @example Binance */
            name?: string;
            /** @example 1 */
            rank?: number;
        };
        person: {
            /** @example vitalik-buterin */
            id?: string;
            /** @example Vitalik Buterin */
            name?: string;
            /**
             * @description Number of teams where person is a member
             * @example 5
             */
            teams_count?: number;
        };
        search_results: {
            currencies?: components["schemas"]["currency"][];
            icos?: components["schemas"]["ico_project"][];
            exchanges?: components["schemas"]["exchange_simplified"][];
            people?: components["schemas"]["person"][];
            tags?: components["schemas"]["tag_simplified"][];
        };
        price_converter_response: {
            /** @example btc-bitcoin */
            base_currency_id?: string;
            /** @example Bitcoin */
            base_currency_name?: string;
            /** @example 2019-02-26T13:32:39Z */
            base_price_last_updated?: string;
            /** @example usd-us-dollars */
            quote_currency_id?: string;
            /** @example US Dollars */
            quote_currency_name?: string;
            /** @example 2019-02-26T13:33:45Z */
            quote_price_last_updated?: string;
            /** @example 100 */
            amount?: number;
            /** @example 386621.99158499995 */
            price?: number;
        };
        /** @description Tick response. Missing values are returned as empty string */
        tick_deprecated: {
            /** @example btc-bitcoin */
            id?: string;
            /** @example Bitcoin */
            name?: string;
            /** @example BTC */
            symbol?: string;
            /** @example 1 */
            rank?: string;
            /** @example 9259.01 */
            price_usd?: string;
            /** @example 1 */
            price_btc?: string;
            /** @example 8102619999 */
            volume_24h_usd?: string;
            /** @example 157468557128 */
            market_cap_usd?: string;
            /** @example 17007062 */
            circulating_supply?: string;
            /** @example 17007062 */
            total_supply?: string;
            /** @example 21000000 */
            max_supply?: string;
            /** @example -0.26 */
            percent_change_1h?: string;
            /** @example 0.22 */
            percent_change_24h?: string;
            /** @example 4.1 */
            percent_change_7d?: string;
            /** @example 1525088839 */
            last_updated?: string;
        };
    };
    responses: never;
    parameters: {
        coin_id: string;
        /** @description Coinpaprika API ID of a coin you want to map to the other provider API IDs */
        coinpaprika_id: string;
        /** @description Coinmarketcap API ID of a coin you want to map to the other provider API IDs */
        coinmarketcap_id: string;
        /** @description Coingecko API ID of a coin you want to map to the other provider API IDs */
        coingecko_id: string;
        /** @description Cryptocompare API ID of a coin you want to map to the other provider API IDs */
        cryptocompare_id: string;
        /** @description [ISIN](https://www.isin.org/isin-for-cryptocurrency/) ID of a coin you want to map to the other provider API IDs */
        isin_id: string;
        /** @description [Digital Token Identifier](https://www.iso.org/obp/ui/en/#iso:std:iso:24165:-2:ed-1:v1:en) of a coin you want to map to the other provider API IDs */
        dti_id: string;
        /** @description Comma separated list of quotes to return. Currently allowed values:  BTC, ETH, USD, EUR, PLN, KRW, GBP, CAD, JPY, RUB, TRY, NZD, AUD, CHF, UAH, HKD, SGD, NGN, PHP, MXN, BRL, THB, CLP, CNY, CZK, DKK, HUF, IDR, ILS, INR, MYR, NOK, PKR, SEK, TWD, ZAR, VND, BOB, COP, PEN, ARS, ISK */
        quotes: string;
        /** @description returned data quote (available values: `usd` `btc`) */
        ohlcv_quote: string;
        /**
         * @description start point for historical data
         *     #### Supported formats:
         *        - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
         *        - Simple date (yyyy-mm-dd) eg. `2018-02-15`
         *        - Unix timestamp (in seconds) eg. `1518671700`
         */
        ohlcv_start: string;
        /**
         * @description end point for ohlcv (max 1 year)
         *     #### Supported formats:
         *        - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
         *        - Simple date (yyyy-mm-dd) eg. `2018-02-15`
         *        - Unix timestamp (in seconds) eg. `1518671700`
         *
         *      If not provided calculated by the limit parameter
         */
        ohlcv_end: string;
        /** @description limit of result rows (max `366`) */
        ohlcv_limit: number;
        /** @description returned OHLCV point interval (available values: `5m`, `15m`, `30m`, `1h`, `6h`, `12h`, `24h`) */
        ohlcv_interval: string;
        person_id: string;
        /** @description Comma separated list of additional fields to include in query result for each tag. Currently supported values are: "coins" and "icos". */
        additional_fields: string;
        tag_id: string;
        /** @description Comma separated list of quotes to return. Up to 3 quotes at once. Currently allowed values:  BTC, ETH, USD, EUR, PLN, KRW, GBP, CAD, JPY, RUB, TRY, NZD, AUD, CHF, UAH, HKD, SGD, NGN, PHP, MXN, BRL, THB, CLP, CNY, CZK, DKK, HUF, IDR, ILS, INR, MYR, NOK, PKR, SEK, TWD, ZAR, VND, BOB, COP, PEN, ARS, ISK */
        tickers_quotes: string;
        /**
         * @description start point for historical data
         *     #### Supported formats:
         *        - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
         *        - Simple date (yyyy-mm-dd) eg. `2018-02-15`
         *        - Unix timestamp (in seconds) eg. `1518671700`
         */
        historical_start: string;
        /**
         * @description end point for historical data
         *     #### Supported formats:
         *      - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
         *      - Simple date (yyyy-mm-dd) eg. `2018-02-15`
         *      - Unix timestamp (in seconds) eg. `1518671700`
         */
        historical_end: string;
        /** @description limit of result rows (max `5000`) */
        historical_limit: number;
        /** @description returned data quote (available values: `usd` `btc`) */
        historical_quote: string;
        /** @description returned points interval (available values: `5m` `10m` `15m` `30m` `45m` `1h` `2h` `3h` `6h` `12h` `24h` `1d` `7d` `14d` `30d` `90d` `365d`) */
        historical_interval: string;
        exchange_id: string;
        platform_id: string;
        contract_address: string;
        /** @description Results page number. The number of records in the response is 100 */
        page: number;
        /** @description phrase for search eg. `btc` */
        search_query: string;
        /** @description one or more categories (comma separated) to search. Available options: `currencies|exchanges|icos|people|tags` */
        search_category: string;
        /** @description set modifier for search results. Available options: `symbol_search` - search only by symbol (works for currencies only) */
        search_modifier: string;
        /** @description limit of results per category (max 250) */
        search_limit: number;
        converter_base_currency_id: string;
        converter_quote_currency_id: string;
        converter_amount: number;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getKeyInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["info"];
                };
            };
            /** @description The request could not be processed due to invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getGlobal: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["global"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoins: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["currency"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoinById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["coin_extended"];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getMappings: {
        parameters: {
            query?: {
                /** @description Coinpaprika API ID of a coin you want to map to the other provider API IDs */
                coinpaprika?: components["parameters"]["coinpaprika_id"];
                /** @description Coinmarketcap API ID of a coin you want to map to the other provider API IDs */
                coinmarketcap?: components["parameters"]["coinmarketcap_id"];
                /** @description Coingecko API ID of a coin you want to map to the other provider API IDs */
                coingecko?: components["parameters"]["coingecko_id"];
                /** @description Cryptocompare API ID of a coin you want to map to the other provider API IDs */
                cryptocompare?: components["parameters"]["cryptocompare_id"];
                /** @description [ISIN](https://www.isin.org/isin-for-cryptocurrency/) ID of a coin you want to map to the other provider API IDs */
                isin?: components["parameters"]["isin_id"];
                /** @description [Digital Token Identifier](https://www.iso.org/obp/ui/en/#iso:std:iso:24165:-2:ed-1:v1:en) of a coin you want to map to the other provider API IDs */
                dti?: components["parameters"]["dti_id"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["api_mappings"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoinTwitter: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["twitter"][];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoinEvents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["event"][];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoinExchanges: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["exchange_with_share"][];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoinMarkets: {
        parameters: {
            query?: {
                /** @description Comma separated list of quotes to return. Currently allowed values:  BTC, ETH, USD, EUR, PLN, KRW, GBP, CAD, JPY, RUB, TRY, NZD, AUD, CHF, UAH, HKD, SGD, NGN, PHP, MXN, BRL, THB, CLP, CNY, CZK, DKK, HUF, IDR, ILS, INR, MYR, NOK, PKR, SEK, TWD, ZAR, VND, BOB, COP, PEN, ARS, ISK */
                quotes?: components["parameters"]["quotes"];
            };
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["coin_market"][];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoinOHLCVLatest: {
        parameters: {
            query?: {
                /** @description returned data quote (available values: `usd` `btc`) */
                quote?: components["parameters"]["ohlcv_quote"];
            };
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["coins_ohlcv"][];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoinOHLCVHistorical: {
        parameters: {
            query: {
                /**
                 * @description start point for historical data
                 *     #### Supported formats:
                 *        - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
                 *        - Simple date (yyyy-mm-dd) eg. `2018-02-15`
                 *        - Unix timestamp (in seconds) eg. `1518671700`
                 */
                start: components["parameters"]["ohlcv_start"];
                /**
                 * @description end point for ohlcv (max 1 year)
                 *     #### Supported formats:
                 *        - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
                 *        - Simple date (yyyy-mm-dd) eg. `2018-02-15`
                 *        - Unix timestamp (in seconds) eg. `1518671700`
                 *
                 *      If not provided calculated by the limit parameter
                 */
                end?: components["parameters"]["ohlcv_end"];
                /** @description limit of result rows (max `366`) */
                limit?: components["parameters"]["ohlcv_limit"];
                /** @description returned OHLCV point interval (available values: `5m`, `15m`, `30m`, `1h`, `6h`, `12h`, `24h`) */
                interval?: components["parameters"]["ohlcv_interval"];
                /** @description returned data quote (available values: `usd` `btc`) */
                quote?: components["parameters"]["ohlcv_quote"];
            };
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["coins_ohlcv"][];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getCoinOHLCVToday: {
        parameters: {
            query?: {
                /** @description returned data quote (available values: `usd` `btc`) */
                quote?: components["parameters"]["ohlcv_quote"];
            };
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["coins_ohlcv"][];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getPeopleById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                person_id: components["parameters"]["person_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["person_by_id"];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getTags: {
        parameters: {
            query?: {
                /** @description Comma separated list of additional fields to include in query result for each tag. Currently supported values are: "coins" and "icos". */
                additional_fields?: components["parameters"]["additional_fields"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tag"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getTagById: {
        parameters: {
            query?: {
                /** @description Comma separated list of additional fields to include in query result for each tag. Currently supported values are: "coins" and "icos". */
                additional_fields?: components["parameters"]["additional_fields"];
            };
            header?: never;
            path: {
                tag_id: components["parameters"]["tag_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tag"];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getTickers: {
        parameters: {
            query?: {
                /** @description Comma separated list of quotes to return. Up to 3 quotes at once. Currently allowed values:  BTC, ETH, USD, EUR, PLN, KRW, GBP, CAD, JPY, RUB, TRY, NZD, AUD, CHF, UAH, HKD, SGD, NGN, PHP, MXN, BRL, THB, CLP, CNY, CZK, DKK, HUF, IDR, ILS, INR, MYR, NOK, PKR, SEK, TWD, ZAR, VND, BOB, COP, PEN, ARS, ISK */
                quotes?: components["parameters"]["tickers_quotes"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tick"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getTickersById: {
        parameters: {
            query?: {
                /** @description Comma separated list of quotes to return. Up to 3 quotes at once. Currently allowed values:  BTC, ETH, USD, EUR, PLN, KRW, GBP, CAD, JPY, RUB, TRY, NZD, AUD, CHF, UAH, HKD, SGD, NGN, PHP, MXN, BRL, THB, CLP, CNY, CZK, DKK, HUF, IDR, ILS, INR, MYR, NOK, PKR, SEK, TWD, ZAR, VND, BOB, COP, PEN, ARS, ISK */
                quotes?: components["parameters"]["tickers_quotes"];
            };
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tick"];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getTickersHistoricalById: {
        parameters: {
            query: {
                /**
                 * @description start point for historical data
                 *     #### Supported formats:
                 *        - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
                 *        - Simple date (yyyy-mm-dd) eg. `2018-02-15`
                 *        - Unix timestamp (in seconds) eg. `1518671700`
                 */
                start: components["parameters"]["historical_start"];
                /**
                 * @description end point for historical data
                 *     #### Supported formats:
                 *      - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
                 *      - Simple date (yyyy-mm-dd) eg. `2018-02-15`
                 *      - Unix timestamp (in seconds) eg. `1518671700`
                 */
                end?: components["parameters"]["historical_end"];
                /** @description limit of result rows (max `5000`) */
                limit?: components["parameters"]["historical_limit"];
                /** @description returned data quote (available values: `usd` `btc`) */
                quote?: components["parameters"]["historical_quote"];
                /** @description returned points interval (available values: `5m` `10m` `15m` `30m` `45m` `1h` `2h` `3h` `6h` `12h` `24h` `1d` `7d` `14d` `30d` `90d` `365d`) */
                interval?: components["parameters"]["historical_interval"];
            };
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["historical_ticks"];
                };
            };
            /** @description invalid parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getExchanges: {
        parameters: {
            query?: {
                /** @description Comma separated list of quotes to return. Currently allowed values:  BTC, ETH, USD, EUR, PLN, KRW, GBP, CAD, JPY, RUB, TRY, NZD, AUD, CHF, UAH, HKD, SGD, NGN, PHP, MXN, BRL, THB, CLP, CNY, CZK, DKK, HUF, IDR, ILS, INR, MYR, NOK, PKR, SEK, TWD, ZAR, VND, BOB, COP, PEN, ARS, ISK */
                quotes?: components["parameters"]["quotes"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["exchange"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getExchangeByID: {
        parameters: {
            query?: {
                /** @description Comma separated list of quotes to return. Currently allowed values:  BTC, ETH, USD, EUR, PLN, KRW, GBP, CAD, JPY, RUB, TRY, NZD, AUD, CHF, UAH, HKD, SGD, NGN, PHP, MXN, BRL, THB, CLP, CNY, CZK, DKK, HUF, IDR, ILS, INR, MYR, NOK, PKR, SEK, TWD, ZAR, VND, BOB, COP, PEN, ARS, ISK */
                quotes?: components["parameters"]["quotes"];
            };
            header?: never;
            path: {
                exchange_id: components["parameters"]["exchange_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["exchange"];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getExchangeMarkets: {
        parameters: {
            query?: {
                /** @description Comma separated list of quotes to return. Currently allowed values:  BTC, ETH, USD, EUR, PLN, KRW, GBP, CAD, JPY, RUB, TRY, NZD, AUD, CHF, UAH, HKD, SGD, NGN, PHP, MXN, BRL, THB, CLP, CNY, CZK, DKK, HUF, IDR, ILS, INR, MYR, NOK, PKR, SEK, TWD, ZAR, VND, BOB, COP, PEN, ARS, ISK */
                quotes?: components["parameters"]["quotes"];
            };
            header?: never;
            path: {
                exchange_id: components["parameters"]["exchange_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["market"][];
                };
            };
            /** @description not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["idNotFoundError"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getPlatforms: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["platform"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getContracts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                platform_id: components["parameters"]["platform_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["contracts_contract"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getTicker: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                platform_id: components["parameters"]["platform_id"];
                contract_address: components["parameters"]["contract_address"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description successful redirect */
            301: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getHistoricalTicker: {
        parameters: {
            query: {
                /**
                 * @description start point for historical data
                 *     #### Supported formats:
                 *        - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
                 *        - Simple date (yyyy-mm-dd) eg. `2018-02-15`
                 *        - Unix timestamp (in seconds) eg. `1518671700`
                 */
                start: components["parameters"]["historical_start"];
                /**
                 * @description end point for historical data
                 *     #### Supported formats:
                 *      - RFC3999 (ISO-8601) eg. `2018-02-15T05:15:00Z`
                 *      - Simple date (yyyy-mm-dd) eg. `2018-02-15`
                 *      - Unix timestamp (in seconds) eg. `1518671700`
                 */
                end?: components["parameters"]["historical_end"];
                /** @description limit of result rows (max `5000`) */
                limit?: components["parameters"]["historical_limit"];
                /** @description returned data quote (available values: `usd` `btc`) */
                quote?: components["parameters"]["historical_quote"];
                /** @description returned points interval (available values: `5m` `10m` `15m` `30m` `45m` `1h` `2h` `3h` `6h` `12h` `24h` `1d` `7d` `14d` `30d` `90d` `365d`) */
                interval?: components["parameters"]["historical_interval"];
            };
            header?: never;
            path: {
                platform_id: components["parameters"]["platform_id"];
                contract_address: components["parameters"]["contract_address"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description successful redirect */
            301: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getChangelogIDs: {
        parameters: {
            query?: {
                /** @description Results page number. The number of records in the response is 100 */
                page?: components["parameters"]["page"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ids_changelog"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    search: {
        parameters: {
            query: {
                /** @description phrase for search eg. `btc` */
                q: components["parameters"]["search_query"];
                /** @description one or more categories (comma separated) to search. Available options: `currencies|exchanges|icos|people|tags` */
                c?: components["parameters"]["search_category"];
                /** @description set modifier for search results. Available options: `symbol_search` - search only by symbol (works for currencies only) */
                modifier?: components["parameters"]["search_modifier"];
                /** @description limit of results per category (max 250) */
                limit?: components["parameters"]["search_limit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["search_results"];
                };
            };
            /** @description invalid parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    priceConverter: {
        parameters: {
            query: {
                base_currency_id: components["parameters"]["converter_base_currency_id"];
                quote_currency_id: components["parameters"]["converter_quote_currency_id"];
                amount?: components["parameters"]["converter_amount"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["price_converter_response"];
                };
            };
            /** @description invalid parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tooManyRequestsError"];
                };
            };
        };
    };
    getTickers__ticker: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tick_deprecated"][];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getTickerById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                coin_id: components["parameters"]["coin_id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tick_deprecated"];
                };
            };
            /** @description too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
