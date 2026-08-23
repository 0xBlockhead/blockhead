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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TezosTokenBalance_TimestampView from '$/views/TezosTokenBalance_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosTokenBalance_Timestamp, {
					$account: data.selector,
					$token: {
						$network: data.selector.$network,
						contractAddress: params.contractAddress,
						tokenId: BigInt(params.tokenId),
					},
					level: BigInt(params.level),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'tezos token balance timestamp'} • tezos token balance timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos token balance timestamp'} • tezos token balance timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosTokenBalance_Timestamp, {
					$account: data.selector,
					$token: {
						$network: data.selector.$network,
						contractAddress: params.contractAddress,
						tokenId: BigInt(params.tokenId),
					},
					level: BigInt(params.level),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<TezosTokenBalance_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
