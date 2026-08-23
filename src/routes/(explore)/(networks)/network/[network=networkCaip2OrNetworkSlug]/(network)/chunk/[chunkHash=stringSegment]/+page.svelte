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
	import NearChunkView from '$/views/NearChunkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearChunk, data.selector, {
					sources: [
						Source.NearRpc_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.chunkHash || 'near chunk')} • near chunk • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'near chunk'} • near chunk • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearChunk, data.selector, {
					sources: [
						Source.NearRpc_JsonRpc,
					],
				}))}

		<NearChunkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
