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

	const pageSelection = $derived(select(EntityType.BlockheadIntentOrder, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			orderId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadIntentOrderView from '$/views/BlockheadIntentOrderView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead intent order' : pageSelection.entity.orderId || 'blockhead intent order')} • blockhead intent order • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadIntentOrderView
		selection={pageSelection}
	/>
</Page>
