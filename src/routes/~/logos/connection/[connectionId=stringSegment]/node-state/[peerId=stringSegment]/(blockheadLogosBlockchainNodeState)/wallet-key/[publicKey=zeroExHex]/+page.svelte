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

	const pageSelection = $derived(select(EntityType.BlockheadLogosBlockchainWalletKeyState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.LogosBlockchainNode_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLogosBlockchainWalletKeyStateView from '$/views/BlockheadLogosBlockchainWalletKeyStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'blockhead Logos blockchain wallet key state')} • blockhead Logos blockchain wallet key state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLogosBlockchainWalletKeyStateView
		selection={pageSelection}
	/>
</Page>
