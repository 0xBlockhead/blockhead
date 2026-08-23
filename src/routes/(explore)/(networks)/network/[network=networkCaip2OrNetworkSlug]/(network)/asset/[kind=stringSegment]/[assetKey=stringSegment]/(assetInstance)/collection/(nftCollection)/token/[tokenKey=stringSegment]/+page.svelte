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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.NftToken, {
		$collection: data.selector,
		tokenKey: params.tokenKey,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NftTokenView from '$/views/NftTokenView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'NFT token'} • NFT token • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'NFT token'} • NFT token • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<NftTokenView
		selection={pageSelection}
	/>
	{/if}
</Page>
