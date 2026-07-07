<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumBeaconFinality_TimestampView from '$/views/EthereumBeaconFinality_TimestampView.svelte'
</script>


<Page>
	<EthereumBeaconFinality_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/finality/[timestampMs=nonNegativeInteger]', {
				caip2: params.caip2,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.EthereumBeaconFinality_Timestamp, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				timestampMs: Number(params.timestampMs),
			}, {
				fields: {
					finalizedCheckpointEpoch: true,
					finalizedCheckpointRoot: true,
					currentJustifiedCheckpointEpoch: true,
					currentJustifiedCheckpointRoot: true,
					previousJustifiedCheckpointEpoch: true,
					previousJustifiedCheckpointRoot: true,
				},
			})
		}
	/>
</Page>
