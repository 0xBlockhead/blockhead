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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FilecoinMessageReceipt, {
		$message: data.selector,
		tipsetKey: params.tipsetKey,
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageReceiptView from '$/views/FilecoinMessageReceiptView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.tipsetKey || 'filecoin message receipt')} • filecoin message receipt • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message receipt'} • filecoin message receipt • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FilecoinMessageReceiptView
		selection={pageSelection}
	/>
	{/if}
</Page>
