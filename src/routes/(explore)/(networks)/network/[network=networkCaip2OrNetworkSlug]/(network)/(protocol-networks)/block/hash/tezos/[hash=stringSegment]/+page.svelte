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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosBlock, {
		$network: data.selector,
		hash: params.hash,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBlockView from '$/views/TezosBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos block'} • tezos block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos block'} • tezos block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
