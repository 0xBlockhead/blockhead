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

	const pageSelection = $derived(select(EntityType.BlockheadMoneroWalletState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroWalletStateView from '$/views/BlockheadMoneroWalletStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.walletId || 'blockhead monero wallet state')} • blockhead monero wallet state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadMoneroWalletStateView
		selection={pageSelection}
	/>
</Page>
