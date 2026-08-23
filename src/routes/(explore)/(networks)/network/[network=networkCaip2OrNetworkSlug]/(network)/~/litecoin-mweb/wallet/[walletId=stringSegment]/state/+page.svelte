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
	import BlockheadLitecoinMwebWalletStateView from '$/views/BlockheadLitecoinMwebWalletStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLitecoinMwebWalletState, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.walletId || 'blockhead litecoin mweb wallet state')} • blockhead litecoin mweb wallet state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead litecoin mweb wallet state'} • blockhead litecoin mweb wallet state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLitecoinMwebWalletState, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<BlockheadLitecoinMwebWalletStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
