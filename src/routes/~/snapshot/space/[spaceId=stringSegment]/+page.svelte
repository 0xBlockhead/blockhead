<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SnapshotSpaceView from '$/views/SnapshotSpaceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SnapshotSpace, data.selector, {
					sources: [
						Source.SnapshotHub_Graphql,
					],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.spaceId ?? '') || 'Snapshot space' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.spaceId || 'Snapshot space')} • Snapshot space • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Snapshot space'} • Snapshot space • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SnapshotSpace, data.selector, {
					sources: [
						Source.SnapshotHub_Graphql,
					],
					fields: {
						name: true,
					},
				}))}

		<SnapshotSpaceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
