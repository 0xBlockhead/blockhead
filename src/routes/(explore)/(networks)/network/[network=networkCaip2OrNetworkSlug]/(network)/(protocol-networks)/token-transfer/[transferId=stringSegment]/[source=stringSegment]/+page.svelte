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
	import TezosTokenTransferView from '$/views/TezosTokenTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosTokenTransfer, {
				$network: data.selector,
				transferId: params.transferId,
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'tezos token transfer'} • tezos token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos token transfer'} • tezos token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosTokenTransfer, {
				$network: data.selector,
				transferId: params.transferId,
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<TezosTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
