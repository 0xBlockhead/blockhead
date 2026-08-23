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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosTokenBalance_Timestamp, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosTokenBalance_TimestampView from '$/views/TezosTokenBalance_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos token balance timestamp'} • tezos token balance timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos token balance timestamp'} • tezos token balance timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosTokenBalance_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
