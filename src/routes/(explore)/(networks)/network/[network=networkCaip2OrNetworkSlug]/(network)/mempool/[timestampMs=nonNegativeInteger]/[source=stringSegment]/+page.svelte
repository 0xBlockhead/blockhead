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

	const pageSelection = $derived(select(EntityType.EvmNetwork_Txpool_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			pendingCount: true,
			queuedCount: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [(String((pageSelection.entitySelector.pendingCount) ?? '') ? String((pageSelection.entitySelector.pendingCount) ?? '') + ' pending' : ''), (String((pageSelection.entitySelector.queuedCount) ?? '') ? String((pageSelection.entitySelector.queuedCount) ?? '') + ' queued' : '')].filter(Boolean).join(' ') || 'EVM network txpool timestamp' : [(String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).pendingCount) ?? '') ? String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).pendingCount) ?? '') + ' pending' : ''), (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).queuedCount) ?? '') ? String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).queuedCount) ?? '') + ' queued' : '')].filter(Boolean).join(' ') || 'EVM network txpool timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_Txpool_TimestampView from '$/views/EvmNetwork_Txpool_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM network txpool timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_Txpool_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
