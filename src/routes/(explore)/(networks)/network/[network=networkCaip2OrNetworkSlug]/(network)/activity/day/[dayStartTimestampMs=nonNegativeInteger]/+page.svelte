<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Network_Activity_Day, data.selector, {
		sources: [data.selector.source],
		fields: {
			transactionCount: true,
			trustModel: true,
			blockCount: true,
			endBlockNumber: true,
			indexedThroughTimestampMs: true,
			resolvedAtMs: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.dayStartTimestampMs) ?? '')].filter(Boolean).join(' ') || 'network activity day' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).dayStartTimestampMs) ?? '')].filter(Boolean).join(' ') || 'network activity day')))


	// Components
	import Page from '$/components/Page.svelte'
	import Network_Activity_DayView from '$/views/Network_Activity_DayView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • network activity day • Blockhead</title>
</svelte:head>


<Page>
	<Network_Activity_DayView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/activity/day/[dayStartTimestampMs=nonNegativeInteger]', {
				network: params.network,
				dayStartTimestampMs: params.dayStartTimestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>
