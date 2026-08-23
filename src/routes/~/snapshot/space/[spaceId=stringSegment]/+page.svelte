<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SnapshotSpace, data.selector, {
		sources: [
			Source.SnapshotHub_Graphql,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SnapshotSpaceView from '$/views/SnapshotSpaceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.spaceId ?? '') || 'Snapshot space' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.spaceId || 'Snapshot space')} • Snapshot space • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Snapshot space'} • Snapshot space • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SnapshotSpaceView
		selection={pageSelection}
	/>
	{/if}
</Page>
