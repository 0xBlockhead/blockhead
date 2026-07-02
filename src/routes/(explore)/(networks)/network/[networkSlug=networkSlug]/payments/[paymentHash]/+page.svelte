<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'


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
	<title>Payment • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningPaymentView
		selection={select(EntityType.BlockheadLightningPayment, {
			$network: { slug: params.networkSlug },
			paymentHash: params.paymentHash,
		})}
		open={true}
	/>
</Page>
