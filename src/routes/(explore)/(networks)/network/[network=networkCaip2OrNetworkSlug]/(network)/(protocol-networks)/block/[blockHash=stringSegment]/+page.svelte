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
	import KaspaBlockView from '$/views/KaspaBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.KaspaBlock, data.selector, {
					sources: [
						Source.KaspaExplorer,
						Source.KaspaNode_Grpc,
						Source.KaspaNode_Rest,
						Source.KaspaNode_Wrpc,
					],
				}))}
			<title>{data?.title ?? 'kaspa block'} • kaspa block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'kaspa block'} • kaspa block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.KaspaBlock, data.selector, {
					sources: [
						Source.KaspaExplorer,
						Source.KaspaNode_Grpc,
						Source.KaspaNode_Rest,
						Source.KaspaNode_Wrpc,
					],
				}))}

		<KaspaBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
