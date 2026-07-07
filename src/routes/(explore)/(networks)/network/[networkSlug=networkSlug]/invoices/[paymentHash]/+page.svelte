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
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
</script>


<Page>
	<BlockheadLightningInvoiceView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/invoices/[paymentHash]', {
				networkSlug: params.networkSlug,
				paymentHash: params.paymentHash,
			})
		}
		selection={
			select(EntityType.BlockheadLightningInvoice, {
				$network: {
					slug: params.networkSlug,
				},
				paymentHash: params.paymentHash,
			}, {
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
			})
		}
	/>
</Page>
