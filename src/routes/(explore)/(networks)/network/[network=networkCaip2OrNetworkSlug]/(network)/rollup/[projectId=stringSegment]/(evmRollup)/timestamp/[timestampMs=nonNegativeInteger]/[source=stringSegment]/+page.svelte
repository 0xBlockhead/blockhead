<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollup_TimestampView from '$/views/EvmRollup_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'EVM rollup timestamp' : [(pageSelection.entity.listingStage ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'EVM rollup timestamp')} • EVM rollup timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmRollup_TimestampView
		selection={pageSelection}
	/>
</Page>
