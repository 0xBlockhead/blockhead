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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.NftCollection, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import NftCollectionView from '$/views/NftCollectionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'NFT collection'} • NFT collection • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'NFT collection'} • NFT collection • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<NftCollectionView
		selection={pageSelection}
	/>
	{/if}
</Page>
