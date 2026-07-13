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
	import BlockheadLightningInvoicesView from '$/views/BlockheadLightningInvoicesView.svelte'
</script>


<svelte:head>
	<title>Invoices • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningInvoicesView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices', {
				network: params.network,
			})
		}
		title='Invoices'
		selection={select(EntityType.LightningNetwork, data.selector).$$invoices}
		id='invoices'
	/>
</Page>
