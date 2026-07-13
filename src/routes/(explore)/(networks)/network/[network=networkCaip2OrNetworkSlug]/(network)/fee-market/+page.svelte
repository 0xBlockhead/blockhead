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
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EvmNetwork_GasFee_BlocksView from '$/views/EvmNetwork_GasFee_BlocksView.svelte'
</script>


<svelte:head>
	<title>Fee market • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmNetwork_GasFee_BlocksView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market', {
						network: params.network,
					})
				}
				title='Fee market'
				selection={
					projection.$$gasFeeBlocks({
						sources: [
							Source.Voltaire_JsonRpc,
						],
					})
				}
				id='gas-fee-blocks'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
