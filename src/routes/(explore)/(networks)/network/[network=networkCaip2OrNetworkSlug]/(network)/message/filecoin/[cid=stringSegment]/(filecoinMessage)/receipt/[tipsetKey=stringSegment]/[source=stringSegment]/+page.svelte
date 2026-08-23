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


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageReceiptView from '$/views/FilecoinMessageReceiptView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessageReceipt, {
				$message: data.selector,
				tipsetKey: params.tipsetKey,
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.tipsetKey || 'filecoin message receipt')} • filecoin message receipt • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message receipt'} • filecoin message receipt • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessageReceipt, {
				$message: data.selector,
				tipsetKey: params.tipsetKey,
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<FilecoinMessageReceiptView
		selection={pageSelection}
	/>
	{/if}
</Page>
