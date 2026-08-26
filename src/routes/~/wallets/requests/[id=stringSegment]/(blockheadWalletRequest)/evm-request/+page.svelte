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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadEvmWalletRequest, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadEvmWalletRequestView from '$/views/BlockheadEvmWalletRequestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Blockhead EVM wallet request'} • Blockhead EVM wallet request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Blockhead EVM wallet request'} • Blockhead EVM wallet request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadEvmWalletRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
