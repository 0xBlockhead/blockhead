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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentCard_SnapshotView from '$/views/A2aAgentCard_SnapshotView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aAgentCard_Snapshot, data.selector, {
					sources: [],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.contentHash ?? '') || 'A2A agent card snapshot' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.contentHash || 'A2A agent card snapshot')} • A2A agent card snapshot • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'A2A agent card snapshot'} • A2A agent card snapshot • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aAgentCard_Snapshot, data.selector, {
					sources: [],
					fields: {
						name: true,
					},
				}))}

		<A2aAgentCard_SnapshotView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
