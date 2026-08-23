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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoGovernanceProposal_TimestampView from '$/views/CardanoGovernanceProposal_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoGovernanceProposal_Timestamp, {
				$proposal: data.selector,
				epoch: Number(params.epoch),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'Epoch ' + String(pageSelection.entitySelector.epoch)} • Cardano governance proposal timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano governance proposal timestamp'} • Cardano governance proposal timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoGovernanceProposal_Timestamp, {
				$proposal: data.selector,
				epoch: Number(params.epoch),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<CardanoGovernanceProposal_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
