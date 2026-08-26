<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandTransactionGroup, {
		$network: data.selector,
		group: params.group,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandTransactionGroupView from '$/views/AlgorandTransactionGroupView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand transaction group'} • algorand transaction group • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand transaction group'} • algorand transaction group • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandTransactionGroupView
		selection={pageSelection}
	/>
	{/if}
</Page>
