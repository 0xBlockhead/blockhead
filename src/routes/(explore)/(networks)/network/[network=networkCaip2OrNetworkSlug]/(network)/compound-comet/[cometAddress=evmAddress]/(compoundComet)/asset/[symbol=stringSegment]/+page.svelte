<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CompoundCometAsset, {
		$comet: data.selector,
		symbol: params.symbol,
	}, {
		sources: [
			Source.Compound_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CompoundCometAssetView from '$/views/CompoundCometAssetView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.symbol || 'Compound Comet collateral asset')} • Compound Comet collateral asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Compound Comet collateral asset'} • Compound Comet collateral asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CompoundCometAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
