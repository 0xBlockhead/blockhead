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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosContract, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosContractView from '$/views/TezosContractView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos contract'} • tezos contract • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos contract'} • tezos contract • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosContractView
		selection={pageSelection}
	/>
	{/if}
</Page>
