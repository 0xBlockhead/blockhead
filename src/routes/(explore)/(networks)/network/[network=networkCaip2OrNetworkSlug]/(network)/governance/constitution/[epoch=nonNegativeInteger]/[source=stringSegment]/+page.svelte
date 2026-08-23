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
	import CardanoConstitution_EpochView from '$/views/CardanoConstitution_EpochView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoConstitution_Epoch, data.selector, {
				sources: [data.selector.source],
			})}
		<title>{data?.title ?? 'Cardano constitution epoch'} • Cardano constitution epoch • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano constitution epoch'} • Cardano constitution epoch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoConstitution_Epoch, data.selector, {
				sources: [data.selector.source],
			})}

	<CardanoConstitution_EpochView
		selection={pageSelection}
	/>
	{/if}
</Page>
