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
	import TezosTokenView from '$/views/TezosTokenView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosToken, data.selector)}
		<title>{data?.title ?? 'tezos token'} • tezos token • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos token'} • tezos token • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosToken, data.selector)}

	<TezosTokenView
		selection={pageSelection}
	/>
	{/if}
</Page>
