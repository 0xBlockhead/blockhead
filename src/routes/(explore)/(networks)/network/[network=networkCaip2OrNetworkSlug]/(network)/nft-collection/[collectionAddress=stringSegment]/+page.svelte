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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonNftCollection, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TonNftCollectionView from '$/views/TonNftCollectionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON NFT collection'} • TON NFT collection • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON NFT collection'} • TON NFT collection • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonNftCollectionView
		selection={pageSelection}
	/>
	{/if}
</Page>
