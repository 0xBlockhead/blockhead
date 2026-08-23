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
	import TezosBlockView from '$/views/TezosBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBlock, {
					$network: data.selector,
					level: BigInt(params.level),
				}))}
			<title>{data?.title ?? 'tezos block'} • tezos block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos block'} • tezos block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosBlock, {
					$network: data.selector,
					level: BigInt(params.level),
				}))}

		<TezosBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
