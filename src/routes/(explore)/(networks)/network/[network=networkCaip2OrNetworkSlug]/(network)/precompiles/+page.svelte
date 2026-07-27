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
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<svelte:head>
	<title>Precompiles • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/precompiles',
				{
					network: String(params.network),
				}
			)
		}
		title='Precompiles'
		selection={select(EntityType.Network, data.selector).Evm.$$precompiles}
		id='precompiles'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
