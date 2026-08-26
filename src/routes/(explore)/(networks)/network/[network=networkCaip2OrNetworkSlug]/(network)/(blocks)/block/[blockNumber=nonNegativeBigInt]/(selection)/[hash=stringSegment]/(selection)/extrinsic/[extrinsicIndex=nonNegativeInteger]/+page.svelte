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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PolkadotExtrinsic, {
		$block: data.selector,
		indexInBlock: Number(params.extrinsicIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInBlock ?? '') ? 'Extrinsic #' + String(pageSelection.entitySelector.indexInBlock ?? '') : '') || 'Polkadot extrinsic')} • Polkadot extrinsic • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot extrinsic'} • Polkadot extrinsic • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PolkadotExtrinsicView
		selection={pageSelection}
	/>
	{/if}
</Page>
