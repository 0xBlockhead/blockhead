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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ZeroGStorageNode, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGStorageNodeView from '$/views/ZeroGStorageNodeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'zero g storage node'} • zero g storage node • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g storage node'} • zero g storage node • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ZeroGStorageNodeView
		selection={pageSelection}
	/>
	{/if}
</Page>
