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
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
</script>


<svelte:head>
	<title>Lightning invoice • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningInvoiceView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/invoices/[paymentHash]', {
				networkSlug: params.networkSlug,
				paymentHash: params.paymentHash,
			})
		}
		selection={
			select(EntityType.BlockheadLightningInvoice, data.selector, {
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
