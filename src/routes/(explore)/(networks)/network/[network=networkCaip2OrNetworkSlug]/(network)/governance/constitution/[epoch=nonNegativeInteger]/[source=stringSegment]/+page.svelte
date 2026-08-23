<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


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
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoConstitution_Epoch, data.selector, {
					sources: [data.selector.source],
				}))}
			<title>{data?.title ?? 'Cardano constitution epoch'} • Cardano constitution epoch • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cardano constitution epoch'} • Cardano constitution epoch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoConstitution_Epoch, data.selector, {
					sources: [data.selector.source],
				}))}

		<CardanoConstitution_EpochView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
