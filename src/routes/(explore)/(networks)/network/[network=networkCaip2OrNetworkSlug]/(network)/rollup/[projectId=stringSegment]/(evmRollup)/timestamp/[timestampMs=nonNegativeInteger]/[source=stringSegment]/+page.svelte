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

	const pageSelection = $derived(select(EntityType.EvmRollup_Timestamp, {
		$rollup: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$rollup: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			listingStage: true,
			isArchived: true,
			isUpcoming: true,
			isUnderReview: true,
			sourceUpdatedAt: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.listingStage) ?? ''), String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM rollup timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).listingStage) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM rollup timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollup_TimestampView from '$/views/EvmRollup_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM rollup timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmRollup_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				projectId: params.projectId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
