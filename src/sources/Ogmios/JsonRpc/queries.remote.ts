import { query } from '$app/server'

import {
	getEpoch as getEpochFromOgmios,
	getLedgerTip as getLedgerTipFromOgmios,
	getNetworkBlockHeight as getNetworkBlockHeightFromOgmios,
	getNetworkTip as getNetworkTipFromOgmios,
	getProtocolParameters as getProtocolParametersFromOgmios,
} from '$/sources/Ogmios/JsonRpc/queries.ts'

export const getLedgerTip = query(() => getLedgerTipFromOgmios())
export const getNetworkTip = query(() => getNetworkTipFromOgmios())
export const getNetworkBlockHeight = query(() => getNetworkBlockHeightFromOgmios())
export const getEpoch = query(() => getEpochFromOgmios())
export const getProtocolParameters = query(() => getProtocolParametersFromOgmios())
