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

	const pageSelection = $derived(select(EntityType.BlockheadLitecoinMwebWalletState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLitecoinMwebWalletStateView from '$/views/BlockheadLitecoinMwebWalletStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.walletId || 'blockhead litecoin mweb wallet state')} • blockhead litecoin mweb wallet state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLitecoinMwebWalletStateView
		selection={pageSelection}
	/>
</Page>
