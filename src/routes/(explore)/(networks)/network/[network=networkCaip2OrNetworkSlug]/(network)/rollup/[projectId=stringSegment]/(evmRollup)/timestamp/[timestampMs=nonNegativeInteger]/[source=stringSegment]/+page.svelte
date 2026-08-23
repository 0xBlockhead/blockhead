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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollup_TimestampView from '$/views/EvmRollup_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmRollup_Timestamp, {
				$rollup: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					listingStage: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'EVM rollup timestamp' : [(pageSelection.entity.listingStage ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'EVM rollup timestamp')} • EVM rollup timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM rollup timestamp'} • EVM rollup timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmRollup_Timestamp, {
				$rollup: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					listingStage: true,
				},
			})}

	<EvmRollup_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
