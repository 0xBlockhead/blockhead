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
	import TezosBlockView from '$/views/TezosBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosBlock, {
				$network: data.selector,
				hash: params.hash,
			})}
		<title>{data?.title ?? 'tezos block'} • tezos block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos block'} • tezos block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosBlock, {
				$network: data.selector,
				hash: params.hash,
			})}

	<TezosBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
