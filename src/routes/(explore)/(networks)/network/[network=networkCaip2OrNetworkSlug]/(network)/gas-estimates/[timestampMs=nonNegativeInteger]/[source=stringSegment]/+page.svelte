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

	const pageSelection = $derived(select(EntityType.EvmNetwork_GasEstimate_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			fastGwei: true,
			slowGwei: true,
			averageGwei: true,
			transport: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [(String((pageSelection.entitySelector.fastGwei) ?? '') ? String((pageSelection.entitySelector.fastGwei) ?? '') + ' gwei' : ''), String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM network gas estimate timestamp' : [(String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).fastGwei) ?? '') ? String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).fastGwei) ?? '') + ' gwei' : ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM network gas estimate timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM network gas estimate timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasEstimate_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
