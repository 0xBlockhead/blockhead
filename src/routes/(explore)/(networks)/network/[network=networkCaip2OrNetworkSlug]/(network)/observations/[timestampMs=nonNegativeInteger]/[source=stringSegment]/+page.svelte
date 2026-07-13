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

	const pageSelection = $derived(select(EntityType.EvmNetwork_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			blockHeight: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [(String((pageSelection.entitySelector.blockHeight) ?? '') ? 'Block ' + String((pageSelection.entitySelector.blockHeight) ?? '') : ''), String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM network timestamp' : [(String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockHeight) ?? '') ? 'Block ' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockHeight) ?? '') : ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM network timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_TimestampView from '$/views/EvmNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
