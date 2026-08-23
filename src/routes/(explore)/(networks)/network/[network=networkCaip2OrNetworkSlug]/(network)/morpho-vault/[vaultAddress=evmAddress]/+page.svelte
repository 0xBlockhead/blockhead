<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MorphoVaultView from '$/views/MorphoVaultView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MorphoVault, data.selector, {
				sources: [
					Source.Morpho_Graphql,
				],
				fields: {
					name: true,
					symbol: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Morpho vault' : [pageSelection.entity.name, pageSelection.entity.symbol].filter(Boolean).join(' ') || 'Morpho vault')} • Morpho vault • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Morpho vault'} • Morpho vault • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MorphoVault, data.selector, {
				sources: [
					Source.Morpho_Graphql,
				],
				fields: {
					name: true,
					symbol: true,
				},
			})}

	<MorphoVaultView
		selection={pageSelection}
	/>
	{/if}
</Page>
