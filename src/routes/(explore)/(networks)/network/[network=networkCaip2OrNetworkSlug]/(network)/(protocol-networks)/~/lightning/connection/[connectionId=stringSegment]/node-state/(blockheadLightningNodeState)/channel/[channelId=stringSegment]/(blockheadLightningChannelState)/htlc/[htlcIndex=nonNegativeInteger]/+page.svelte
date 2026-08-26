<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadLightningHtlc, {
		$channelState: data.selector,
		htlcIndex: Number(params.htlcIndex),
	}, {
		sources: [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningHtlcView from '$/views/BlockheadLightningHtlcView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'HTLC ' + String(pageSelection.entitySelector.htlcIndex)} • local LND HTLC • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local LND HTLC'} • local LND HTLC • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadLightningHtlcView
		selection={pageSelection}
	/>
	{/if}
</Page>
