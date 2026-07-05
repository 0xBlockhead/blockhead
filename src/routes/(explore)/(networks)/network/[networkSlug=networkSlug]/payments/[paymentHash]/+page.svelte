<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'
</script>


<svelte:head>
	<title>Lightning payment • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningPaymentView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/payments/[paymentHash]', {
				networkSlug: params.networkSlug,
				paymentHash: params.paymentHash,
			})
		}
		selection={
			select(EntityType.BlockheadLightningPayment, data.selector, {
				fields: {
					valueMsat: true,
					createdAtMs: true,
					paymentIndex: true,
					$localNodeState: true,
					$invoice: true,
					paymentRequest: true,
				},
			})
		}
	/>
</Page>
