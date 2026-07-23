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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EthereumBeaconFinality_Timestamp, data.selector, {
		fields: {
			finalizedCheckpointEpoch: true,
			finalizedCheckpointRoot: true,
			currentJustifiedCheckpointEpoch: true,
			currentJustifiedCheckpointRoot: true,
			previousJustifiedCheckpointEpoch: true,
			previousJustifiedCheckpointRoot: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumBeaconFinality_TimestampView from '$/views/EthereumBeaconFinality_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'ethereum beacon finality timestamp' : [(String((({ ...data.selector, ...pageSelection.entity }).finalizedCheckpointEpoch) ?? '') ? 'Finalized epoch ' + String((({ ...data.selector, ...pageSelection.entity }).finalizedCheckpointEpoch) ?? '') : '')].filter(Boolean).join(' ') || 'ethereum beacon finality timestamp'))} • ethereum beacon finality timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EthereumBeaconFinality_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/finality/[timestampMs=nonNegativeInteger]', {
				network: params.network,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>
