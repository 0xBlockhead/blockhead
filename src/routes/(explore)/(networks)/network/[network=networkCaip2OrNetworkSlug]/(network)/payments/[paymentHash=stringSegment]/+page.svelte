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

	const pageSelection = $derived(select(EntityType.BlockheadLightningPayment, data.selector, {
		sources: [
			Source.LightningLnd_Rest,
		],
		fields: {
			valueMsat: true,
			createdAtMs: true,
			paymentIndex: true,
			$localNodeState: true,
			$invoice: true,
			paymentRequest: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning payment' : [String((({ ...data.selector, ...pageSelection.entity }).paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning payment'))} • Lightning payment • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningPaymentView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/payments/[paymentHash=stringSegment]', {
				network: params.network,
				paymentHash: params.paymentHash,
			})
		}
		selection={pageSelection}
	/>
</Page>
