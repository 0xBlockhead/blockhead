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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CosmosDenom, data.selector, {
		fields: {
			symbol: true,
			display: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosDenomView from '$/views/CosmosDenomView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.denom ?? '') || 'Cosmos denom' : [(pageSelection.entity.symbol ?? ''), (pageSelection.entity.display ?? ''), pageSelection.entitySelector.denom].filter(Boolean).join(' ') || 'Cosmos denom')} • Cosmos denom • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cosmos denom'} • Cosmos denom • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CosmosDenomView
		selection={pageSelection}
	/>
	{/if}
</Page>
