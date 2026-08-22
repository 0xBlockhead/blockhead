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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadCashuWalletState, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.walletId || 'blockhead Cashu wallet state')} • blockhead Cashu wallet state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCashuWalletStateView
		selection={pageSelection}
	/>
</Page>
