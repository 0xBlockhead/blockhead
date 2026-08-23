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


	// Components
	import Page from '$/components/Page.svelte'
	import NftTokenView from '$/views/NftTokenView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NftToken, {
				$collection: data.selector,
				tokenKey: params.tokenKey,
			})}
		<title>{data?.title ?? 'NFT token'} • NFT token • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'NFT token'} • NFT token • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NftToken, {
				$collection: data.selector,
				tokenKey: params.tokenKey,
			})}

	<NftTokenView
		selection={pageSelection}
	/>
	{/if}
</Page>
