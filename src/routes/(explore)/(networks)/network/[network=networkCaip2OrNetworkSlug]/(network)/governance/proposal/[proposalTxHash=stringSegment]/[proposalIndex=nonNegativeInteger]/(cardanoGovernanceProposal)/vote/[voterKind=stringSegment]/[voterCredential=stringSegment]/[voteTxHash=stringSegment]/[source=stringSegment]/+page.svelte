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

	const pageSelection = $derived(select(EntityType.CardanoGovernanceVote, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoGovernanceVoteView from '$/views/CardanoGovernanceVoteView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Cardano governance vote' : pageSelection.entity.vote || 'Cardano governance vote')} • Cardano governance vote • Blockhead</title>
</svelte:head>


<Page>
	<CardanoGovernanceVoteView
		selection={pageSelection}
	/>
</Page>
