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
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EvmNetworkBridgesView from '$/views/EvmNetworkBridgesView.svelte'
</script>


<svelte:head>
	<title>Bridges • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmNetworkBridgesView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/bridges', {
						network: params.network,
					})
				}
				title='Bridges'
				selection={projection.$$bridges}
				id='bridges'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
