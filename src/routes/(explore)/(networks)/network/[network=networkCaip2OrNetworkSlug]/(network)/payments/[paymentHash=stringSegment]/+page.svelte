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

	const pageSelection = $derived(select(EntityType.BlockheadLightningPayment, data.selector, {
		sources: [
			Source.LightningLnd_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.paymentHash || 'local LND payment')} • local LND payment • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningPaymentView
		selection={pageSelection}
	/>
</Page>
