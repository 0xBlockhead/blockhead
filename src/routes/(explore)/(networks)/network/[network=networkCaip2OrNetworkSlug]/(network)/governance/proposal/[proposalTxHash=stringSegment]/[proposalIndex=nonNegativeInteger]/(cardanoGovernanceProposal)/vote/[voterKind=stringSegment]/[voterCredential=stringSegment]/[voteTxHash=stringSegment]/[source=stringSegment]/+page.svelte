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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoGovernanceVoteView from '$/views/CardanoGovernanceVoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoGovernanceVote, {
					$proposal: data.selector,
					voterKind: params.voterKind,
					voterCredential: params.voterCredential,
					voteTxHash: params.voteTxHash,
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						vote: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Cardano governance vote' : pageSelection.entity.vote || 'Cardano governance vote')} • Cardano governance vote • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cardano governance vote'} • Cardano governance vote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoGovernanceVote, {
					$proposal: data.selector,
					voterKind: params.voterKind,
					voterCredential: params.voterCredential,
					voteTxHash: params.voteTxHash,
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						vote: true,
					},
				}))}

		<CardanoGovernanceVoteView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
