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
	import CardanoCommittee_EpochView from '$/views/CardanoCommittee_EpochView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoCommittee_Epoch, data.selector, {
				sources: [data.selector.source],
			})}
		<title>{data?.title ?? 'Epoch ' + String(pageSelection.entitySelector.epoch)} • Cardano committee epoch • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano committee epoch'} • Cardano committee epoch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoCommittee_Epoch, data.selector, {
				sources: [data.selector.source],
			})}

	<CardanoCommittee_EpochView
		selection={pageSelection}
	/>
	{/if}
</Page>
