<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadEvmWalletRequestView from '$/views/BlockheadEvmWalletRequestView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadEvmWalletRequest, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? 'Blockhead EVM wallet request'} • Blockhead EVM wallet request • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Blockhead EVM wallet request'} • Blockhead EVM wallet request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadEvmWalletRequest, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<BlockheadEvmWalletRequestView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
