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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosOperation, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosOperationView from '$/views/TezosOperationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos operation'} • tezos operation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos operation'} • tezos operation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosOperationView
		selection={pageSelection}
	/>
	{/if}
</Page>
