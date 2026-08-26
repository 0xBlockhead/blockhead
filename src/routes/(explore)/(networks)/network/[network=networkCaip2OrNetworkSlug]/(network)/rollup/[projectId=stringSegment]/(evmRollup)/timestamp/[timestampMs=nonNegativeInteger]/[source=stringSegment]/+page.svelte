<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmRollup_Timestamp, {
		$rollup: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			listingStage: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollup_TimestampView from '$/views/EvmRollup_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'EVM rollup timestamp' : [(pageSelection.entity.listingStage ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'EVM rollup timestamp')} • EVM rollup timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM rollup timestamp'} • EVM rollup timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmRollup_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
