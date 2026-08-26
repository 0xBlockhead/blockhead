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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoCommittee_Epoch, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoCommittee_EpochView from '$/views/CardanoCommittee_EpochView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Epoch ' + String(pageSelection.entitySelector.epoch)} • Cardano committee epoch • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano committee epoch'} • Cardano committee epoch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoCommittee_EpochView
		selection={pageSelection}
	/>
	{/if}
</Page>
