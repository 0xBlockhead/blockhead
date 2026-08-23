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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BridgeTransfer, {
		$sourceTx: data.selector,
		source: params.source,
		logIndex: Number(params.logIndex),
	}, {
		sources: [params.source],
		fields: {
			transferId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'bridge transfer' : pageSelection.entity.transferId || 'bridge transfer')} • bridge transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bridge transfer'} • bridge transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BridgeTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
