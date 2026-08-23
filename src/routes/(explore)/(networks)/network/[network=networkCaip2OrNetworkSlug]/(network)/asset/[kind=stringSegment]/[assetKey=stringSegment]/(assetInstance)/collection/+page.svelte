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


	// Components
	import Page from '$/components/Page.svelte'
	import NftCollectionView from '$/views/NftCollectionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NftCollection, data.selector)}
		<title>{data?.title ?? 'NFT collection'} • NFT collection • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'NFT collection'} • NFT collection • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NftCollection, data.selector)}

	<NftCollectionView
		selection={pageSelection}
	/>
	{/if}
</Page>
