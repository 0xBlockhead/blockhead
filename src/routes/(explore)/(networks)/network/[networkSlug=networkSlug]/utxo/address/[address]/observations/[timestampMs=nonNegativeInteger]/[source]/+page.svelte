<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoAddress_TimestampView from '$/views/UtxoAddress_TimestampView.svelte'
</script>


<Page>
	<UtxoAddress_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				networkSlug: params.networkSlug,
				address: params.address,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.UtxoAddress_Timestamp, {
				$address: {
					$network: {
						slug: params.networkSlug,
					},
					address: decodeURIComponent(params.address),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$address: {
					$network: {
						slug: params.networkSlug,
					},
					address: decodeURIComponent(params.address),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					balanceSats: true,
					transactionCount: true,
					fundedOutputCount: true,
					fundedValueSats: true,
					spentOutputCount: true,
					spentValueSats: true,
					unspentOutputCount: true,
					mempoolTransactionCount: true,
				},
			})
		}
	/>
</Page>
