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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadTransferRequest, {
		id: params.id,
		$network: data.selector,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadTransferRequestView from '$/views/BlockheadTransferRequestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.id || 'blockhead transfer request')} • blockhead transfer request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead transfer request'} • blockhead transfer request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadTransferRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
