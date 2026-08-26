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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ZeroGServiceRequest, data.selector, {
		sources: [
			Source.ZeroGChain_JsonRpc,
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.requestId || 'zero g service request')} • zero g service request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g service request'} • zero g service request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ZeroGServiceRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
