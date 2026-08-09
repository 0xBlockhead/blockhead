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
	<title>{data.title ?? 'NFT collection'} • NFT collection • Blockhead</title>
</svelte:head>


<Page>
	<NftCollectionView
		selection={select(EntityType.NftCollection, data.selector)}
	/>
</Page>
