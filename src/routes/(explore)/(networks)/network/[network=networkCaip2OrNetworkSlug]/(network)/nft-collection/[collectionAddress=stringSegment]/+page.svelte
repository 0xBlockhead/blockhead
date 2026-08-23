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
	import TonNftCollectionView from '$/views/TonNftCollectionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonNftCollection, data.selector))}
			<title>{data?.title ?? 'TON NFT collection'} • TON NFT collection • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'TON NFT collection'} • TON NFT collection • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonNftCollection, data.selector))}

		<TonNftCollectionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
