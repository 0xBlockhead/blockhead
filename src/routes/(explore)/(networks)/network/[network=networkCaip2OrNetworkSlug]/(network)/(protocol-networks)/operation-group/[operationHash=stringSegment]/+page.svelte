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
	import TezosOperationGroupView from '$/views/TezosOperationGroupView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosOperationGroup, data.selector)}
		<title>{data?.title ?? 'tezos operation group'} • tezos operation group • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos operation group'} • tezos operation group • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosOperationGroup, data.selector)}

	<TezosOperationGroupView
		selection={pageSelection}
	/>
	{/if}
</Page>
