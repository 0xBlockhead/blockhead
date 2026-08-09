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

	const pageSelection = $derived(select(EntityType.CosmosGovernanceProposal_Timestamp, {
		$proposal: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			status: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosGovernanceProposal_TimestampView from '$/views/CosmosGovernanceProposal_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.source ?? '') || 'Cosmos governance proposal timestamp' : [(pageSelection.entity.status ?? ''), pageSelection.entitySelector.source].filter(Boolean).join(' ') || 'Cosmos governance proposal timestamp')} • Cosmos governance proposal timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CosmosGovernanceProposal_TimestampView
		selection={pageSelection}
	/>
</Page>
