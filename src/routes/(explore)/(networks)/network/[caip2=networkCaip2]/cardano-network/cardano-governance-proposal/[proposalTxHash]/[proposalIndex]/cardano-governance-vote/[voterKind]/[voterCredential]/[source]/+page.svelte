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
	import CardanoGovernanceVoteView from '$/views/CardanoGovernanceVoteView.svelte'
</script>


<Page>
	<CardanoGovernanceVoteView
		selection={select(EntityType.CardanoGovernanceVote, data.selector)}
	/>
</Page>
