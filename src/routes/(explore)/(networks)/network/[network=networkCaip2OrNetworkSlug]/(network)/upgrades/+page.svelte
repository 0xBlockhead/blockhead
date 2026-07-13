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
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
</script>


<svelte:head>
	<title>Upgrades • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EthereumNetworkUpgradesView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrades', {
						network: params.network,
					})
				}
				title='Upgrades'
				selection={
					projection.$$upgrades({
						sources: [
							Source.Constants_Internal,
						],
						count: true,
					})
				}
				id='upgrades'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
