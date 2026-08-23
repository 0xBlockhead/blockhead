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


	// Components
	import Page from '$/components/Page.svelte'
	import TezosOperationView from '$/views/TezosOperationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosOperation, data.selector)}
		<title>{data?.title ?? 'tezos operation'} • tezos operation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos operation'} • tezos operation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosOperation, data.selector)}

	<TezosOperationView
		selection={pageSelection}
	/>
	{/if}
</Page>
