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

	const pageSelection = $derived(select(EntityType.BlockheadMoneroSubaddressState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			address: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroSubaddressStateView from '$/views/BlockheadMoneroSubaddressStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.walletId ?? '') || 'blockhead monero subaddress state' : (pageSelection.entity.address ?? '') || pageSelection.entitySelector.walletId || 'blockhead monero subaddress state')} • blockhead monero subaddress state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadMoneroSubaddressStateView
		selection={pageSelection}
	/>
</Page>
