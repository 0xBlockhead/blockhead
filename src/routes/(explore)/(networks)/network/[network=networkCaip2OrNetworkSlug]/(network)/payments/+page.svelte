<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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
	{@const collectionSelection = select(EntityType.LightningNetwork, data.selector).$$payments}

	<BlockheadLightningPaymentsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments',
				{
					network: params.network,
				}
			)
		}
		title='Payments'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='payments'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
