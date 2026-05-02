/**
 * Standard Ethereum beacon node REST (`/eth/v1/...`) — @see https://github.com/ethereum/beacon-APIs
 */

import { proxyFetch } from '$/lib/http.ts'

type BeaconHeaderHeadWire = {
	data?: {
		header?: {
			message?: {
				slot?: string
			}
		}
	}
}

export const getBeaconHeadSlot = async (beaconRestBaseUrl: string): Promise<number> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await proxyFetch(`${base}/eth/v1/beacon/headers/head`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) throw new Error(`Beacon GET head ${res.status} ${res.statusText}`)
	const wire = (await res.json()) as BeaconHeaderHeadWire
	const raw = wire.data?.header?.message?.slot
	if (raw == null) throw new Error('Beacon: head response missing slot')
	const n = Number.parseInt(String(raw), 10)
	if (!Number.isFinite(n)) throw new Error('Beacon: invalid head slot')
	return n
}
