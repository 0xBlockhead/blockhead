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
	import PolkadotReferendumView from '$/views/PolkadotReferendumView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PolkadotReferendum, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.referendumId || 'Polkadot referendum')} • Polkadot referendum • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot referendum'} • Polkadot referendum • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PolkadotReferendum, data.selector)}

	<PolkadotReferendumView
		selection={pageSelection}
	/>
	{/if}
</Page>
