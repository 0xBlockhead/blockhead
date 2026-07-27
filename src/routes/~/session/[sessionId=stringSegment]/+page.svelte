<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadSession, {
		id: params.sessionId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			status: true,
			updatedAt: true,
			createdAt: true,
			lockedAt: true,
			$latestSimulation: true,
			simulationCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'session' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.id || 'session')} • session • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSessionView
		selection={pageSelection}
	/>
</Page>
