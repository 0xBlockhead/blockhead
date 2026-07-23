<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
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
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice' : [String((({ ...data.selector, ...pageSelection.entity }).memo) ?? '')].filter(Boolean).join(' ') || [String((({ ...data.selector, ...pageSelection.entity }).paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice'))} • Lightning invoice • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningInvoiceView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
				network: params.network,
				paymentHash: params.paymentHash,
			})
		}
		selection={pageSelection}
	/>
</Page>
