<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.BlockheadLightningInvoice, data.selector, {
		sources: [
			Source.LightningLnd_Rest,
		],
		fields: {
			memo: true,
			valueMsat: true,
			createdAtMs: true,
			expirySeconds: true,
			private: true,
			addIndex: true,
			$localNodeState: true,
			paymentRequest: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.paymentHash ?? '') || 'Lightning invoice' : (pageSelection.entity.memo ?? '') || pageSelection.entitySelector.paymentHash || 'Lightning invoice'))} • Lightning invoice • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningInvoiceView
		selection={pageSelection}
	/>
</Page>
