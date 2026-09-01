import { expect, it, vi } from 'vitest'

import bindings from '$/sources/QuilibriumNodeMetrics/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getPrometheusText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Prometheus/client.ts', () => ({
	getPrometheusText,
}))

const { getMetrics } = await import('$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts')

it('reads the registered metrics binding and preserves transport failures', async () => {
	const binding = bindings[Source.QuilibriumNodeMetrics_Prometheus][0]
	getPrometheusText.mockResolvedValueOnce('quilibrium_peer_count 3\n')
	await expect(getMetrics()).resolves.toBe('quilibrium_peer_count 3\n')
	expect(getPrometheusText).toHaveBeenCalledWith(binding)

	const transportFailure = new Error('metrics transport failed')
	getPrometheusText.mockRejectedValueOnce(transportFailure)
	await expect(getMetrics()).rejects.toBe(transportFailure)
})
