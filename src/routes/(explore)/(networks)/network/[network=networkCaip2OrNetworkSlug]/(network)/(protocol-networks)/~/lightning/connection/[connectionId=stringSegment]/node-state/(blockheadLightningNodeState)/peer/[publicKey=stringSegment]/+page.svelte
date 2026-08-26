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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadLightningPeer, data.selector, {
		sources: [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningPeerView from '$/views/BlockheadLightningPeerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'local LND peer')} • local LND peer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local LND peer'} • local LND peer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadLightningPeerView
		selection={pageSelection}
	/>
	{/if}
</Page>
