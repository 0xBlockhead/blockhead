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
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AssetInstance, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						symbol: true,
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Asset instance' : [pageSelection.entity.symbol, pageSelection.entity.name].filter(Boolean).join(' ') || 'Asset instance')} • Asset instance • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Asset instance'} • Asset instance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AssetInstance, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						symbol: true,
						name: true,
					},
				}))}

		<AssetInstanceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
