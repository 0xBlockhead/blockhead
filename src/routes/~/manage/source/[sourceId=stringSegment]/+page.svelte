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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadSource, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.Local_Internal,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'source' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.id || 'source')} • source • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'source'} • source • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadSourceView
		selection={pageSelection}
	/>
	{/if}
</Page>
