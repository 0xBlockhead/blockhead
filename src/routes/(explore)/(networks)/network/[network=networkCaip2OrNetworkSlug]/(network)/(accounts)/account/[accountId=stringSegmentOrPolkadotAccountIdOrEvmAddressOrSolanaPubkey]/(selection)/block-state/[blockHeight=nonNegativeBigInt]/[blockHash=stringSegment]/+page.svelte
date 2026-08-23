<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import NearAccount_BlockView from '$/views/NearAccount_BlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearAccount_Block, {
					$account: data.selector,
					$block: {
						$network: data.selector.$network,
						height: BigInt(params.blockHeight),
						hash: params.blockHash,
					},
				}, {
					sources: [
						Source.NearRpc_JsonRpc,
					],
				}))}
			<title>{data?.title ?? 'near account block state'} • near account block state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'near account block state'} • near account block state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearAccount_Block, {
					$account: data.selector,
					$block: {
						$network: data.selector.$network,
						height: BigInt(params.blockHeight),
						hash: params.blockHash,
					},
				}, {
					sources: [
						Source.NearRpc_JsonRpc,
					],
				}))}

		<NearAccount_BlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
