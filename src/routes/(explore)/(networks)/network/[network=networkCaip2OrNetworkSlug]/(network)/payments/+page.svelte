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
	import BlockheadLightningPaymentsView from '$/views/BlockheadLightningPaymentsView.svelte'
</script>


<svelte:head>
	<title>Payments • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningPaymentsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/payments', {
				network: params.network,
			})
		}
		title='Payments'
		selection={select(EntityType.LightningNetwork, data.selector).$$payments}
		id='payments'
	/>
</Page>
