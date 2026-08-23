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
	import AlgorandTransactionGroupView from '$/views/AlgorandTransactionGroupView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AlgorandTransactionGroup, {
					$network: data.selector,
					group: params.group,
				}))}
			<title>{data?.title ?? 'algorand transaction group'} • algorand transaction group • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'algorand transaction group'} • algorand transaction group • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AlgorandTransactionGroup, {
					$network: data.selector,
					group: params.group,
				}))}

		<AlgorandTransactionGroupView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
