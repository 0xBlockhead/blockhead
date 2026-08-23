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
	import TonTransactionView from '$/views/TonTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonTransaction, {
				$account: data.selector.$account,
				lt: BigInt(params.lt),
				hash: params.hash,
			})}
		<title>{data?.title ?? 'TON transaction'} • TON transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON transaction'} • TON transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonTransaction, {
				$account: data.selector.$account,
				lt: BigInt(params.lt),
				hash: params.hash,
			})}

	<TonTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
