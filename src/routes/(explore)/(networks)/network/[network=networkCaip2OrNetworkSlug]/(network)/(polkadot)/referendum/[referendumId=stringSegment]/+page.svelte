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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PolkadotReferendum, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotReferendumView from '$/views/PolkadotReferendumView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.referendumId || 'Polkadot referendum')} • Polkadot referendum • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot referendum'} • Polkadot referendum • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PolkadotReferendumView
		selection={pageSelection}
	/>
	{/if}
</Page>
