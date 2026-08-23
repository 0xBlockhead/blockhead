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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGDataChunkView from '$/views/ZeroGDataChunkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGDataChunk, {
					$dataBlob: data.selector,
					chunkIndex: Number(params.chunkIndex),
				}))}
			<title>{data?.title ?? 'zero g data chunk'} • zero g data chunk • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'zero g data chunk'} • zero g data chunk • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGDataChunk, {
					$dataBlob: data.selector,
					chunkIndex: Number(params.chunkIndex),
				}))}

		<ZeroGDataChunkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
