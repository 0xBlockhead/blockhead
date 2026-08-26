<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadAlgorandParticipationKey, {
		nodeId: params.nodeId,
		participationId: params.participationId,
	}, {
		sources: [
			Source.Nodely,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAlgorandParticipationKeyView from '$/views/BlockheadAlgorandParticipationKeyView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.participationId || 'blockhead algorand participation key'} • blockhead algorand participation key • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAlgorandParticipationKeyView
		selection={pageSelection}
	/>
</Page>
