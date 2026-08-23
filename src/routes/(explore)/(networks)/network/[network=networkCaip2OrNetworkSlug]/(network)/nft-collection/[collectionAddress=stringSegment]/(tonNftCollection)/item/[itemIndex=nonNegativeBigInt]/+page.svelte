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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonNftItem, {
		$collection: data.selector,
		itemIndex: BigInt(params.itemIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TonNftItemView from '$/views/TonNftItemView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON NFT item'} • TON NFT item • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON NFT item'} • TON NFT item • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonNftItemView
		selection={pageSelection}
	/>
	{/if}
</Page>
