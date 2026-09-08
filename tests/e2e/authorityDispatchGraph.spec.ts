import { expect, test } from 'vitest'

import {
	actionAuthorityRequestEnvelopeHash,
	authorityRequestEnvelope,
} from '$/actions/execution.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import {
	authorityRequestEnvelopeHashBindings,
} from './authorityDispatchGraph.ts'


test('reports a persisted envelope hash that differs from its envelope as unmatched', () => {
	const envelope = authorityRequestEnvelope.assert({
		adapterKey: 'evm.personal-sign',
		adapterVersion: '1',
		value: {
			chainId: 1,
			accountAddress: '0x1111111111111111111111111111111111111111',
			message: 'authority oracle must reject mismatched hashes',
		},
	})
	const computedEnvelopeHash = actionAuthorityRequestEnvelopeHash(envelope)
	const mismatchedEnvelopeHash = Hash32.assert(`0x${'00'.repeat(32)}`)

	expect(mismatchedEnvelopeHash).not.toBe(computedEnvelopeHash)
	expect(authorityRequestEnvelopeHashBindings([
		{
			selectorKey: '{"id":"authority-request-1"}',
			envelope,
		},
	], [
		{
			selectorKey: '{"id":"authority-request-1"}',
			envelopeHash: mismatchedEnvelopeHash,
		},
	])).toEqual([
		{
			authorityRequestSelectorKey: '{"id":"authority-request-1"}',
			envelopeHash: mismatchedEnvelopeHash,
			computedEnvelopeHash,
			matches: false,
		},
	])
})
