<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ZeroGDataChunk, {
		$dataBlob: data.selector,
		chunkIndex: Number(params.chunkIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGDataChunkView from '$/views/ZeroGDataChunkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'zero g data chunk'} • zero g data chunk • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g data chunk'} • zero g data chunk • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ZeroGDataChunkView
		selection={pageSelection}
	/>
	{/if}
</Page>
