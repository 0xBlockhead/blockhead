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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonJettonTransfer, {
		$network: data.selector,
		transferId: params.transferId,
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TonJettonTransferView from '$/views/TonJettonTransferView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON jetton transfer'} • TON jetton transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON jetton transfer'} • TON jetton transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonJettonTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
