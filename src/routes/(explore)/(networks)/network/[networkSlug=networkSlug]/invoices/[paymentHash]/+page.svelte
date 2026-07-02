<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Invoice • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningInvoiceView
		selection={select(EntityType.BlockheadLightningInvoice, {
			$network: { slug: params.networkSlug },
			paymentHash: params.paymentHash,
		})}
		open={true}
	/>
</Page>
