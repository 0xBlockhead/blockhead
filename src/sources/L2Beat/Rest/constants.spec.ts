import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	l2BeatHostChainByLabel,
	l2BeatProjectIdByChainId,
	scalingSummarySyncedUntilMs,
} from '$/sources/L2Beat/Rest/constants.ts'

describe('L2Beat REST constants', () => {
	it('maps Robinhood Chain settlement and known EVM project ids', () => {
		expect(l2BeatHostChainByLabel.get('Robinhood Chain')?.parentChainId).toBe(4663)
		expect(l2BeatProjectIdByChainId.get('4663')).toBe('robinhood')
		expect(l2BeatProjectIdByChainId.get('100')).toBe('gnosis')
		expect(l2BeatProjectIdByChainId.get('42161')).toBe('arbitrum')
		expect(l2BeatProjectIdByChainId.has('1923')).toBe(false)
		expect(scalingSummarySyncedUntilMs(1_785_830_400)).toBe(1_785_830_400_000)
	})
})
