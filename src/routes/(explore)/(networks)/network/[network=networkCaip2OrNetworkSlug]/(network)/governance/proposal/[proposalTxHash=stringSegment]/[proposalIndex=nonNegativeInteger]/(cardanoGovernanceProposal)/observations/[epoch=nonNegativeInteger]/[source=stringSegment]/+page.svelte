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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoGovernanceProposal_Timestamp, {
		$proposal: data.selector,
		epoch: Number(params.epoch),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoGovernanceProposal_TimestampView from '$/views/CardanoGovernanceProposal_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Epoch ' + String(pageSelection.entitySelector.epoch)} • Cardano governance proposal timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano governance proposal timestamp'} • Cardano governance proposal timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoGovernanceProposal_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
