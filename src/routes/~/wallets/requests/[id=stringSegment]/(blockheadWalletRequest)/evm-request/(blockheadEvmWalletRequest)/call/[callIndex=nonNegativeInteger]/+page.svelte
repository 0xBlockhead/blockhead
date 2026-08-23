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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletRequestCallView from '$/views/BlockheadWalletRequestCallView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadWalletRequestCall, {
					$evmRequest: data.selector,
					callIndex: Number(params.callIndex),
				}, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.callIndex ?? '') ? 'Call #' + String(pageSelection.entitySelector.callIndex ?? '') : '') || 'blockhead wallet request call')} • blockhead wallet request call • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead wallet request call'} • blockhead wallet request call • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadWalletRequestCall, {
					$evmRequest: data.selector,
					callIndex: Number(params.callIndex),
				}, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<BlockheadWalletRequestCallView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
