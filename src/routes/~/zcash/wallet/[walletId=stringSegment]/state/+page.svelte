<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadZcashWalletState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZcashWalletStateView from '$/views/BlockheadZcashWalletStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.walletId || 'blockhead zcash wallet state')} • blockhead zcash wallet state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadZcashWalletStateView
		selection={pageSelection}
	/>
</Page>
