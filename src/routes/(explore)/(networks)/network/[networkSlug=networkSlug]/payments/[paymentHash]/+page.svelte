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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'
</script>


<Page>
	<BlockheadLightningPaymentView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/payments/[paymentHash]', {
				networkSlug: params.networkSlug,
				paymentHash: params.paymentHash,
			})
		}
		selection={
			select(EntityType.BlockheadLightningPayment, {
				$network: {
					slug: params.networkSlug,
				},
				paymentHash: params.paymentHash,
			}, {
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
			})
		}
	/>
</Page>
