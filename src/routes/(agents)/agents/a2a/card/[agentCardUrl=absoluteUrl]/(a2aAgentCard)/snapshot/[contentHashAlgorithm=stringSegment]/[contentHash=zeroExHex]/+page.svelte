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

	const pageSelection = $derived(select(EntityType.A2aAgentCard_Snapshot, data.selector, {
		sources: [],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentCard_SnapshotView from '$/views/A2aAgentCard_SnapshotView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.contentHash ?? '') || 'A2A agent card snapshot' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.contentHash || 'A2A agent card snapshot')} • A2A agent card snapshot • Blockhead</title>
</svelte:head>


<Page>
	<A2aAgentCard_SnapshotView
		selection={pageSelection}
	/>
</Page>
