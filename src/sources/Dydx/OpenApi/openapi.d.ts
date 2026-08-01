export interface paths {
    "/addresses/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAddress"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/addresses/{address}/subaccountNumber/{subaccountNumber}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/addresses/{address}/parentSubaccountNumber/{parentSubaccountNumber}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/addresses/{address}/registerToken": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["RegisterToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/addresses/{address}/testNotification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["TestNotification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/affiliates/metadata": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetMetadata"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/affiliates/address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAddress__affiliates_address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/affiliates/referralCode": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["UpdateCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/affiliates/snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetSnapshot"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/affiliates/total_volume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTotalVolume"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetPositions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAssetPositions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetPositions/parentSubaccountNumber": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAssetPositionsForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/candles/perpetualMarkets/{ticker}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetCandles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/screen": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Screen"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/compliance/screen/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Screen__compliance_screen_{address}"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fills": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetFills"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fills/parentSubaccount": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetFillsForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fundingPayments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetFundingPayments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fundingPayments/parentSubaccount": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetFundingPaymentsForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/height": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetHeight"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/historicalBlockTradingRewards/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTradingRewards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/historicalFunding/{ticker}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetHistoricalFunding"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/historical-pnl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetHistoricalPnl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/historical-pnl/parentSubaccountNumber": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetHistoricalPnlForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/historicalTradingRewardAggregations/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAggregations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orderbooks/perpetualMarket/{ticker}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetPerpetualMarket"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ListOrders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/parentSubaccountNumber": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ListOrdersForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{orderId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetOrder"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/perpetualMarkets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ListPerpetualMarkets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/perpetualPositions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ListPositions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/perpetualPositions/parentSubaccountNumber": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ListPositionsForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/pnl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetPnl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/pnl/parentSubaccountNumber": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetPnlForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/trader/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SearchTrader"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sparklines": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/time": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTime"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tradeHistory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTradeHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tradeHistory/parentSubaccountNumber": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTradeHistoryForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/trades/perpetualMarket/{ticker}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTrades"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTransfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transfers/parentSubaccountNumber": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTransfersForParentSubaccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transfers/between": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTransferBetween"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/turnkey/uploadAddress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Uploads the dydx address to the turnkey table.
         *
         *     Backend won't have this information when we create account for user since you need signature
         *     to derive dydx address. Just wait for fe to uplaod to kick off the policy setup.
         */
        post: operations["UploadAddress"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/turnkey/signin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["SignIn"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/turnkey/appleLoginRedirect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Handles Apple login redirect from Apple's authorization server
         *     Exchanges authorization code for ID token and processes user login/signup
         */
        post: operations["AppleLoginRedirect"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/vault/v1/megavault/historicalPnl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetMegavaultHistoricalPnl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/vault/v1/vaults/historicalPnl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetVaultsHistoricalPnl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/vault/v1/megavault/positions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetMegavaultPositions"];
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
        /** @enum {string} */
        PerpetualPositionStatus: "OPEN" | "CLOSED" | "LIQUIDATED";
        /** @enum {string} */
        PositionSide: "LONG" | "SHORT";
        IsoString: string;
        PerpetualPositionResponseObject: {
            market: string;
            status: components["schemas"]["PerpetualPositionStatus"];
            side: components["schemas"]["PositionSide"];
            size: string;
            maxSize: string;
            entryPrice: string;
            realizedPnl: string;
            createdAt: components["schemas"]["IsoString"];
            createdAtHeight: string;
            sumOpen: string;
            sumClose: string;
            netFunding: string;
            unrealizedPnl: string;
            closedAt?: components["schemas"]["IsoString"] | null;
            exitPrice?: string | null;
            /** Format: int32 */
            subaccountNumber: number;
        };
        PerpetualPositionsMap: {
            [key: string]: components["schemas"]["PerpetualPositionResponseObject"];
        };
        AssetPositionResponseObject: {
            symbol: string;
            side: components["schemas"]["PositionSide"];
            size: string;
            assetId: string;
            /** Format: int32 */
            subaccountNumber: number;
        };
        AssetPositionsMap: {
            [key: string]: components["schemas"]["AssetPositionResponseObject"];
        };
        SubaccountResponseObject: {
            address: string;
            /** Format: int32 */
            subaccountNumber: number;
            equity: string;
            freeCollateral: string;
            openPerpetualPositions: components["schemas"]["PerpetualPositionsMap"];
            assetPositions: components["schemas"]["AssetPositionsMap"];
            marginEnabled: boolean;
            updatedAtHeight: string;
            latestProcessedBlockHeight: string;
        };
        AddressResponse: {
            subaccounts: components["schemas"]["SubaccountResponseObject"][];
            totalTradingRewards: string;
        };
        ParentSubaccountResponse: {
            address: string;
            /** Format: int32 */
            parentSubaccountNumber: number;
            equity: string;
            freeCollateral: string;
            childSubaccounts: components["schemas"]["SubaccountResponseObject"][];
        };
        AffiliateMetadataResponse: {
            referralCode: string;
            isVolumeEligible: boolean;
            isAffiliate: boolean;
        };
        AffiliateAddressResponse: {
            address: string;
        };
        CreateReferralCodeResponse: {
            referralCode: string;
        };
        AffiliateSnapshotResponseObject: {
            affiliateAddress: string;
            affiliateReferralCode: string;
            /** Format: double */
            affiliateEarnings: number;
            /** Format: double */
            affiliateReferredTrades: number;
            /** Format: double */
            affiliateTotalReferredFees: number;
            /** Format: double */
            affiliateReferredUsers: number;
            /** Format: double */
            affiliateReferredNetProtocolEarnings: number;
            /** Format: double */
            affiliateReferredTotalVolume: number;
            /** Format: double */
            affiliateReferredMakerFees: number;
            /** Format: double */
            affiliateReferredTakerFees: number;
            /** Format: double */
            affiliateReferredMakerRebates: number;
        };
        AffiliateSnapshotResponse: {
            affiliateList: components["schemas"]["AffiliateSnapshotResponseObject"][];
            /** Format: double */
            total: number;
            /** Format: double */
            currentOffset: number;
        };
        AffiliateTotalVolumeResponse: {
            /** Format: double */
            totalVolume: number | null;
        };
        AssetPositionResponse: {
            positions: components["schemas"]["AssetPositionResponseObject"][];
        };
        /** @enum {string} */
        CandleResolution: "1MIN" | "5MINS" | "15MINS" | "30MINS" | "1HOUR" | "4HOURS" | "1DAY";
        CandleResponseObject: {
            startedAt: components["schemas"]["IsoString"];
            ticker: string;
            resolution: components["schemas"]["CandleResolution"];
            low: string;
            high: string;
            open: string;
            close: string;
            baseTokenVolume: string;
            usdVolume: string;
            /** Format: double */
            trades: number;
            startingOpenInterest: string;
            orderbookMidPriceOpen?: string | null;
            orderbookMidPriceClose?: string | null;
            id: string;
        };
        CandleResponse: {
            candles: components["schemas"]["CandleResponseObject"][];
        };
        ComplianceResponse: {
            restricted: boolean;
            reason?: string;
        };
        /** @enum {string} */
        ComplianceStatus: "COMPLIANT" | "FIRST_STRIKE_CLOSE_ONLY" | "FIRST_STRIKE" | "CLOSE_ONLY" | "BLOCKED";
        /** @enum {string} */
        ComplianceReason: "MANUAL" | "US_GEO" | "CA_GEO" | "GB_GEO" | "SANCTIONED_GEO" | "COMPLIANCE_PROVIDER";
        ComplianceV2Response: {
            status: components["schemas"]["ComplianceStatus"];
            reason?: components["schemas"]["ComplianceReason"];
            updatedAt?: string;
        };
        /** @enum {string} */
        OrderSide: "BUY" | "SELL";
        /** @enum {string} */
        Liquidity: "TAKER" | "MAKER";
        /** @enum {string} */
        FillType: "LIMIT" | "LIQUIDATED" | "LIQUIDATION" | "DELEVERAGED" | "OFFSETTING" | "TWAP_SUBORDER";
        /** @enum {string} */
        MarketType: "PERPETUAL" | "SPOT";
        FillResponseObject: {
            id: string;
            side: components["schemas"]["OrderSide"];
            liquidity: components["schemas"]["Liquidity"];
            type: components["schemas"]["FillType"];
            market: string;
            marketType: components["schemas"]["MarketType"];
            price: string;
            size: string;
            fee: string;
            affiliateRevShare: string;
            createdAt: components["schemas"]["IsoString"];
            createdAtHeight: string;
            orderId?: string;
            clientMetadata?: string;
            /** Format: int32 */
            subaccountNumber: number;
            builderFee?: string;
            builderAddress?: string;
            orderRouterAddress?: string;
            orderRouterFee?: string;
            positionSizeBefore?: string;
            entryPriceBefore?: string;
            positionSideBefore?: string;
        };
        FillResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            fills: components["schemas"]["FillResponseObject"][];
        };
        FundingPaymentResponseObject: {
            createdAt: components["schemas"]["IsoString"];
            createdAtHeight: string;
            perpetualId: string;
            ticker: string;
            oraclePrice: string;
            size: string;
            side: string;
            rate: string;
            payment: string;
            subaccountNumber: string;
            fundingIndex: string;
        };
        FundingPaymentResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            fundingPayments: components["schemas"]["FundingPaymentResponseObject"][];
        };
        HeightResponse: {
            height: string;
            time: components["schemas"]["IsoString"];
        };
        HistoricalBlockTradingReward: {
            tradingReward: string;
            createdAt: components["schemas"]["IsoString"];
            createdAtHeight: string;
        };
        HistoricalBlockTradingRewardsResponse: {
            rewards: components["schemas"]["HistoricalBlockTradingReward"][];
        };
        HistoricalFundingResponseObject: {
            ticker: string;
            rate: string;
            price: string;
            effectiveAt: components["schemas"]["IsoString"];
            effectiveAtHeight: string;
        };
        HistoricalFundingResponse: {
            historicalFunding: components["schemas"]["HistoricalFundingResponseObject"][];
        };
        PnlTicksResponseObject: {
            equity: string;
            totalPnl: string;
            netTransfers: string;
            createdAt: string;
            blockHeight: string;
            blockTime: components["schemas"]["IsoString"];
        };
        HistoricalPnlResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            historicalPnl: components["schemas"]["PnlTicksResponseObject"][];
        };
        /** @enum {string} */
        TradingRewardAggregationPeriod: "DAILY" | "WEEKLY" | "MONTHLY";
        HistoricalTradingRewardAggregation: {
            tradingReward: string;
            startedAt: components["schemas"]["IsoString"];
            startedAtHeight: string;
            endedAt?: components["schemas"]["IsoString"];
            endedAtHeight?: string;
            period: components["schemas"]["TradingRewardAggregationPeriod"];
        };
        HistoricalTradingRewardAggregationsResponse: {
            rewards: components["schemas"]["HistoricalTradingRewardAggregation"][];
        };
        OrderbookResponsePriceLevel: {
            price: string;
            size: string;
        };
        OrderbookResponseObject: {
            bids: components["schemas"]["OrderbookResponsePriceLevel"][];
            asks: components["schemas"]["OrderbookResponsePriceLevel"][];
        };
        /** @enum {string} */
        APITimeInForce: "GTT" | "FOK" | "IOC";
        /** @enum {string} */
        OrderStatus: "OPEN" | "FILLED" | "CANCELED" | "BEST_EFFORT_CANCELED" | "UNTRIGGERED" | "ERROR";
        /** @enum {string} */
        BestEffortOpenedStatus: "BEST_EFFORT_OPENED";
        APIOrderStatus: components["schemas"]["OrderStatus"] | components["schemas"]["BestEffortOpenedStatus"];
        /** @enum {string} */
        OrderType: "LIMIT" | "MARKET" | "STOP_LIMIT" | "STOP_MARKET" | "TRAILING_STOP" | "TAKE_PROFIT" | "TAKE_PROFIT_MARKET" | "TWAP" | "TWAP_SUBORDER";
        OrderResponseObject: {
            id: string;
            subaccountId: string;
            clientId: string;
            clobPairId: string;
            side: components["schemas"]["OrderSide"];
            size: string;
            totalFilled: string;
            price: string;
            type: components["schemas"]["OrderType"];
            reduceOnly: boolean;
            orderFlags: string;
            goodTilBlock?: string;
            goodTilBlockTime?: string;
            createdAtHeight?: string;
            createdAt?: components["schemas"]["IsoString"];
            clientMetadata: string;
            triggerPrice?: string;
            builderAddress?: string;
            feePpm?: string;
            orderRouterAddress?: string;
            duration?: string;
            interval?: string;
            priceTolerance?: string;
            timeInForce: components["schemas"]["APITimeInForce"];
            status: components["schemas"]["APIOrderStatus"];
            postOnly: boolean;
            ticker: string;
            updatedAt?: components["schemas"]["IsoString"];
            updatedAtHeight?: string;
            /** Format: int32 */
            subaccountNumber: number;
        };
        /** @enum {string} */
        PerpetualMarketStatus: "ACTIVE" | "PAUSED" | "CANCEL_ONLY" | "POST_ONLY" | "INITIALIZING" | "FINAL_SETTLEMENT";
        /** @enum {string} */
        PerpetualMarketType: "CROSS" | "ISOLATED";
        PerpetualMarketResponseObject: {
            clobPairId: string;
            ticker: string;
            status: components["schemas"]["PerpetualMarketStatus"];
            oraclePrice: string;
            priceChange24H: string;
            volume24H: string;
            /** Format: int32 */
            trades24H: number;
            nextFundingRate: string;
            initialMarginFraction: string;
            maintenanceMarginFraction: string;
            openInterest: string;
            /** Format: int32 */
            atomicResolution: number;
            /** Format: int32 */
            quantumConversionExponent: number;
            tickSize: string;
            stepSize: string;
            /** Format: int32 */
            stepBaseQuantums: number;
            /** Format: int32 */
            subticksPerTick: number;
            marketType: components["schemas"]["PerpetualMarketType"];
            openInterestLowerCap?: string;
            openInterestUpperCap?: string;
            baseOpenInterest: string;
            defaultFundingRate1H?: string;
        };
        PerpetualMarketResponse: {
            markets: {
                [key: string]: components["schemas"]["PerpetualMarketResponseObject"];
            };
        };
        PerpetualPositionResponse: {
            positions: components["schemas"]["PerpetualPositionResponseObject"][];
        };
        PnlResponseObject: {
            equity: string;
            netTransfers: string;
            totalPnl: string;
            createdAt: string;
            createdAtHeight: string;
        };
        PnlResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            pnl: components["schemas"]["PnlResponseObject"][];
        };
        TraderSearchResponseObject: {
            address: string;
            /** Format: double */
            subaccountNumber: number;
            subaccountId: string;
            username: string;
        };
        TraderSearchResponse: {
            result?: components["schemas"]["TraderSearchResponseObject"];
        };
        SparklineResponseObject: {
            [key: string]: string[];
        };
        /** @enum {string} */
        SparklineTimePeriod: "ONE_DAY" | "SEVEN_DAYS";
        TimeResponse: {
            iso: components["schemas"]["IsoString"];
            /** Format: double */
            epoch: number;
        };
        /** @enum {string} */
        TradeHistoryType: "OPEN" | "EXTEND" | "PARTIAL_CLOSE" | "CLOSE" | "LIQUIDATION_PARTIAL_CLOSE" | "LIQUIDATION_CLOSE";
        TradeHistoryResponseObject: {
            id: string;
            /** Format: double */
            subaccountNumber: number;
            action: components["schemas"]["TradeHistoryType"];
            executionPrice: string;
            entryPrice: string;
            side: components["schemas"]["OrderSide"];
            positionSide: components["schemas"]["PositionSide"] | null;
            prevSize: string;
            additionalSize: string;
            value: string;
            orderType: components["schemas"]["OrderType"] | null;
            netFee: string;
            netRealizedPnl: string;
            netRealizedPnlPercent: string | null;
            time: components["schemas"]["IsoString"];
            orderId: string | null;
            marketId: string;
            marginMode: components["schemas"]["PerpetualMarketType"];
        };
        TradeHistoryResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            tradeHistory: components["schemas"]["TradeHistoryResponseObject"][];
        };
        /** @enum {string} */
        TradeType: "LIMIT" | "LIQUIDATED" | "DELEVERAGED" | "TWAP_SUBORDER";
        TradeResponseObject: {
            id: string;
            side: components["schemas"]["OrderSide"];
            size: string;
            price: string;
            type: components["schemas"]["TradeType"];
            createdAt: components["schemas"]["IsoString"];
            createdAtHeight: string;
        };
        TradeResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            trades: components["schemas"]["TradeResponseObject"][];
        };
        /** @enum {string} */
        TransferType: "TRANSFER_IN" | "TRANSFER_OUT" | "DEPOSIT" | "WITHDRAWAL";
        TransferResponseObject: {
            id: string;
            sender: {
                /** Format: int32 */
                subaccountNumber?: number;
                address: string;
            };
            recipient: {
                /** Format: int32 */
                subaccountNumber?: number;
                address: string;
            };
            size: string;
            createdAt: string;
            createdAtHeight: string;
            symbol: string;
            type: components["schemas"]["TransferType"];
            transactionHash: string;
        };
        TransferResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            transfers: components["schemas"]["TransferResponseObject"][];
        };
        ParentSubaccountTransferResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            transfers: components["schemas"]["TransferResponseObject"][];
        };
        TransferBetweenResponse: {
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            totalResults?: number;
            /** Format: int32 */
            offset?: number;
            transfersSubset: components["schemas"]["TransferResponseObject"][];
            totalNetTransfers: string;
        };
        TurnkeyAuthResponse: {
            dydxAddress?: string;
            organizationId?: string;
            apiKeyId?: string;
            userId?: string;
            session?: string;
            salt: string;
            alreadyExists?: boolean;
        };
        /** @enum {string} */
        SigninMethod: "email" | "social" | "passkey";
        /** @description Request interface for user sign-in operations */
        SignInRequest: {
            /** @description The authentication method to use (EMAIL, SOCIAL, or PASSKEY) */
            signinMethod: components["schemas"]["SigninMethod"];
            /** @description User's email address (required for EMAIL signin method) */
            userEmail?: string;
            /** @description Target public key for authentication (required for EMAIL and SOCIAL signin methods) */
            targetPublicKey?: string;
            /** @description OAuth provider name (required for SOCIAL signin method) */
            provider?: string;
            /** @description OIDC token from OAuth provider (required for SOCIAL signin method) */
            oidcToken?: string;
            /** @description Challenge string for passkey authentication (required for PASSKEY signin method) */
            challenge?: string;
            /** @description Attestation object for passkey authentication (required for PASSKEY signin method) */
            attestation?: {
                transports: ("AUTHENTICATOR_TRANSPORT_BLE" | "AUTHENTICATOR_TRANSPORT_INTERNAL" | "AUTHENTICATOR_TRANSPORT_NFC" | "AUTHENTICATOR_TRANSPORT_USB" | "AUTHENTICATOR_TRANSPORT_HYBRID")[];
                attestationObject: string;
                clientDataJson: string;
                credentialId: string;
            };
            /** @description Optional magic link template URL for email authentication */
            magicLink?: string;
        };
        AppleLoginResponse: {
            success: boolean;
            encodedPayload?: string;
            error?: string;
        };
        AppleLoginRedirectRequest: {
            state: string;
            code: string;
        };
        MegavaultHistoricalPnlResponse: {
            megavaultPnl: components["schemas"]["PnlTicksResponseObject"][];
        };
        /** @enum {string} */
        PnlTickInterval: "hour" | "day";
        VaultHistoricalPnl: {
            ticker: string;
            historicalPnl: components["schemas"]["PnlTicksResponseObject"][];
        };
        VaultsHistoricalPnlResponse: {
            vaultsPnl: components["schemas"]["VaultHistoricalPnl"][];
        };
        VaultPosition: {
            ticker: string;
            assetPosition: components["schemas"]["AssetPositionResponseObject"];
            perpetualPosition?: components["schemas"]["PerpetualPositionResponseObject"];
            equity: string;
        };
        MegavaultPositionResponse: {
            positions: components["schemas"]["VaultPosition"][];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    GetAddress: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AddressResponse"];
                };
            };
        };
    };
    GetSubaccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                address: string;
                subaccountNumber: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubaccountResponseObject"];
                };
            };
        };
    };
    GetParentSubaccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                address: string;
                parentSubaccountNumber: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentSubaccountResponse"];
                };
            };
        };
    };
    RegisterToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                address: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    language: string;
                    token: string;
                };
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    TestNotification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetMetadata: {
        parameters: {
            query: {
                address: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AffiliateMetadataResponse"];
                };
            };
        };
    };
    GetAddress__affiliates_address: {
        parameters: {
            query: {
                referralCode: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AffiliateAddressResponse"];
                };
            };
        };
    };
    UpdateCode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    newCode: string;
                    address: string;
                };
            };
        };
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreateReferralCodeResponse"];
                };
            };
        };
    };
    GetSnapshot: {
        parameters: {
            query?: {
                addressFilter?: string[];
                offset?: number;
                limit?: number;
                sortByAffiliateEarning?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AffiliateSnapshotResponse"];
                };
            };
        };
    };
    GetTotalVolume: {
        parameters: {
            query: {
                address: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AffiliateTotalVolumeResponse"];
                };
            };
        };
    };
    GetAssetPositions: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetPositionResponse"];
                };
            };
        };
    };
    GetAssetPositionsForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetPositionResponse"];
                };
            };
        };
    };
    GetCandles: {
        parameters: {
            query: {
                resolution: components["schemas"]["CandleResolution"];
                limit?: number;
                fromISO?: string;
                toISO?: string;
            };
            header?: never;
            path: {
                ticker: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CandleResponse"];
                };
            };
        };
    };
    Screen: {
        parameters: {
            query: {
                address: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplianceResponse"];
                };
            };
        };
    };
    "Screen__compliance_screen_{address}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplianceV2Response"];
                };
            };
        };
    };
    GetFills: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
                market?: string;
                marketType?: components["schemas"]["MarketType"];
                includeTypes?: components["schemas"]["FillType"][];
                excludeTypes?: components["schemas"]["FillType"][];
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FillResponse"];
                };
            };
        };
    };
    GetFillsForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
                includeTypes?: components["schemas"]["FillType"][];
                excludeTypes?: components["schemas"]["FillType"][];
                limit?: number;
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FillResponse"];
                };
            };
        };
    };
    GetFundingPayments: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
                limit?: number;
                ticker?: string;
                afterOrAt?: components["schemas"]["IsoString"];
                page?: number;
                zeroPayments?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FundingPaymentResponse"];
                };
            };
        };
    };
    GetFundingPaymentsForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
                limit?: number;
                afterOrAt?: components["schemas"]["IsoString"];
                page?: number;
                zeroPayments?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FundingPaymentResponse"];
                };
            };
        };
    };
    GetHeight: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HeightResponse"];
                };
            };
        };
    };
    GetTradingRewards: {
        parameters: {
            query?: {
                limit?: number;
                startingBeforeOrAt?: components["schemas"]["IsoString"];
                startingBeforeOrAtHeight?: string;
            };
            header?: never;
            path: {
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HistoricalBlockTradingRewardsResponse"];
                };
            };
        };
    };
    GetHistoricalFunding: {
        parameters: {
            query?: {
                limit?: number;
                effectiveBeforeOrAtHeight?: number;
                effectiveBeforeOrAt?: components["schemas"]["IsoString"];
            };
            header?: never;
            path: {
                ticker: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HistoricalFundingResponse"];
                };
            };
        };
    };
    GetHistoricalPnl: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
                createdOnOrAfterHeight?: number;
                createdOnOrAfter?: components["schemas"]["IsoString"];
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HistoricalPnlResponse"];
                };
            };
        };
    };
    GetHistoricalPnlForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
                createdOnOrAfterHeight?: number;
                createdOnOrAfter?: components["schemas"]["IsoString"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HistoricalPnlResponse"];
                };
            };
        };
    };
    GetAggregations: {
        parameters: {
            query: {
                period: components["schemas"]["TradingRewardAggregationPeriod"];
                limit?: number;
                startingBeforeOrAt?: components["schemas"]["IsoString"];
                startingBeforeOrAtHeight?: string;
            };
            header?: never;
            path: {
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HistoricalTradingRewardAggregationsResponse"];
                };
            };
        };
    };
    GetPerpetualMarket: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ticker: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderbookResponseObject"];
                };
            };
        };
    };
    ListOrders: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
                limit?: number;
                ticker?: string;
                side?: components["schemas"]["OrderSide"];
                type?: components["schemas"]["OrderType"];
                includeTypes?: components["schemas"]["OrderType"][];
                excludeTypes?: components["schemas"]["OrderType"][];
                status?: components["schemas"]["APIOrderStatus"][];
                goodTilBlockBeforeOrAt?: number;
                goodTilBlockAfter?: number;
                goodTilBlockTimeBeforeOrAt?: components["schemas"]["IsoString"];
                goodTilBlockTimeAfter?: components["schemas"]["IsoString"];
                returnLatestOrders?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderResponseObject"][];
                };
            };
        };
    };
    ListOrdersForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
                limit?: number;
                ticker?: string;
                side?: components["schemas"]["OrderSide"];
                type?: components["schemas"]["OrderType"];
                includeTypes?: components["schemas"]["OrderType"][];
                excludeTypes?: components["schemas"]["OrderType"][];
                status?: components["schemas"]["APIOrderStatus"][];
                goodTilBlockBeforeOrAt?: number;
                goodTilBlockAfter?: number;
                goodTilBlockTimeBeforeOrAt?: components["schemas"]["IsoString"];
                goodTilBlockTimeAfter?: components["schemas"]["IsoString"];
                returnLatestOrders?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderResponseObject"][];
                };
            };
        };
    };
    GetOrder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                orderId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderResponseObject"];
                };
            };
        };
    };
    ListPerpetualMarkets: {
        parameters: {
            query?: {
                limit?: number;
                ticker?: string;
                market?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerpetualMarketResponse"];
                };
            };
        };
    };
    ListPositions: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
                status?: components["schemas"]["PerpetualPositionStatus"][];
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerpetualPositionResponse"];
                };
            };
        };
    };
    ListPositionsForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
                status?: components["schemas"]["PerpetualPositionStatus"][];
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerpetualPositionResponse"];
                };
            };
        };
    };
    GetPnl: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
                createdOnOrAfterHeight?: number;
                createdOnOrAfter?: components["schemas"]["IsoString"];
                page?: number;
                daily?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PnlResponse"];
                };
            };
        };
    };
    GetPnlForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
                createdOnOrAfterHeight?: number;
                createdOnOrAfter?: components["schemas"]["IsoString"];
                daily?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PnlResponse"];
                };
            };
        };
    };
    SearchTrader: {
        parameters: {
            query: {
                searchParam: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TraderSearchResponse"];
                };
            };
        };
    };
    Get: {
        parameters: {
            query: {
                timePeriod: components["schemas"]["SparklineTimePeriod"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SparklineResponseObject"];
                };
            };
        };
    };
    GetTime: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TimeResponse"];
                };
            };
        };
    };
    GetTradeHistory: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
                market?: string;
                marketType?: components["schemas"]["MarketType"];
                limit?: number;
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TradeHistoryResponse"];
                };
            };
        };
    };
    GetTradeHistoryForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
                market?: string;
                marketType?: components["schemas"]["MarketType"];
                limit?: number;
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TradeHistoryResponse"];
                };
            };
        };
    };
    GetTrades: {
        parameters: {
            query?: {
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
                page?: number;
            };
            header?: never;
            path: {
                ticker: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TradeResponse"];
                };
            };
        };
    };
    GetTransfers: {
        parameters: {
            query: {
                address: string;
                subaccountNumber: number;
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransferResponse"];
                };
            };
        };
    };
    GetTransfersForParentSubaccount: {
        parameters: {
            query: {
                address: string;
                parentSubaccountNumber: number;
                limit?: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentSubaccountTransferResponse"];
                };
            };
        };
    };
    GetTransferBetween: {
        parameters: {
            query: {
                sourceAddress: string;
                sourceSubaccountNumber: number;
                recipientAddress: string;
                recipientSubaccountNumber: number;
                createdBeforeOrAtHeight?: number;
                createdBeforeOrAt?: components["schemas"]["IsoString"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransferBetweenResponse"];
                };
            };
        };
    };
    UploadAddress: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    signature: string;
                    dydxAddress: string;
                };
            };
        };
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success: boolean;
                    };
                };
            };
        };
    };
    SignIn: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignInRequest"];
            };
        };
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TurnkeyAuthResponse"];
                };
            };
        };
    };
    AppleLoginRedirect: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AppleLoginRedirectRequest"];
            };
        };
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppleLoginResponse"];
                };
            };
        };
    };
    GetMegavaultHistoricalPnl: {
        parameters: {
            query?: {
                resolution?: components["schemas"]["PnlTickInterval"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MegavaultHistoricalPnlResponse"];
                };
            };
        };
    };
    GetVaultsHistoricalPnl: {
        parameters: {
            query?: {
                resolution?: components["schemas"]["PnlTickInterval"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VaultsHistoricalPnlResponse"];
                };
            };
        };
    };
    GetMegavaultPositions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ok */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MegavaultPositionResponse"];
                };
            };
        };
    };
}
