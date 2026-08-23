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
	import SuiBalanceChangeView from '$/views/SuiBalanceChangeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiBalanceChange, {
				$transaction: data.selector,
				changeIndex: Number(params.changeIndex),
			})}
		<title>{data?.title ?? 'Sui balance change'} • Sui balance change • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui balance change'} • Sui balance change • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiBalanceChange, {
				$transaction: data.selector,
				changeIndex: Number(params.changeIndex),
			})}

	<SuiBalanceChangeView
		selection={pageSelection}
	/>
	{/if}
</Page>
