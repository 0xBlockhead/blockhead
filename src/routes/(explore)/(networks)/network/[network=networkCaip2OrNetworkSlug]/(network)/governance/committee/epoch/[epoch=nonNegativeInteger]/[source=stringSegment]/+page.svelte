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

	const pageSelection = $derived(select(EntityType.CardanoCommittee_Epoch, data.selector, {
		sources: [data.selector.source],
		fields: {
			memberCount: true,
			dissolved: true,
			govActionId: true,
			$seatingProposal: true,
			quorumNumerator: true,
			quorumDenominator: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoCommittee_EpochView from '$/views/CardanoCommittee_EpochView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Epoch ' + String(pageSelection.entitySelector.epoch)} • Cardano committee epoch • Blockhead</title>
</svelte:head>


<Page>
	<CardanoCommittee_EpochView
		selection={pageSelection}
	/>
</Page>
