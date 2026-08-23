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
	import BlockheadZcashWalletStateView from '$/views/BlockheadZcashWalletStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadZcashWalletState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.ZcashClientBackend_Local,
						Source.ZcashLightwalletd_Grpc,
						Source.ZcashdWallet_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.walletId || 'blockhead zcash wallet state')} • blockhead zcash wallet state • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead zcash wallet state'} • blockhead zcash wallet state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadZcashWalletState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.ZcashClientBackend_Local,
						Source.ZcashLightwalletd_Grpc,
						Source.ZcashdWallet_JsonRpc,
					],
				}))}

		<BlockheadZcashWalletStateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
