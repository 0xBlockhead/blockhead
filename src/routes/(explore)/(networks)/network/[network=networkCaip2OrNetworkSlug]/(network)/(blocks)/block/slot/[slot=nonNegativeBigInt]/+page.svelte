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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoBlockView from '$/views/CardanoBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoBlock, data.selector, {
				fields: {
					hash: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Cardano block' : pageSelection.entity.hash || 'Cardano block')} • Cardano block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano block'} • Cardano block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoBlock, data.selector, {
				fields: {
					hash: true,
				},
			})}

	<CardanoBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
