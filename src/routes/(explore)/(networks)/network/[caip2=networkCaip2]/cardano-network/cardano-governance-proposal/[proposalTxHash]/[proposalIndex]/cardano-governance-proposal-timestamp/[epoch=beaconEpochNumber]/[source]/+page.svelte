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
	import CardanoGovernanceProposal_TimestampView from '$/views/CardanoGovernanceProposal_TimestampView.svelte'
</script>


<Page>
	<CardanoGovernanceProposal_TimestampView
		selection={select(EntityType.CardanoGovernanceProposal_Timestamp, data.selector)}
	/>
</Page>
