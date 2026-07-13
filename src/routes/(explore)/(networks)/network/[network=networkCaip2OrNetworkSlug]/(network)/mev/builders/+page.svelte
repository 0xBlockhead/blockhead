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
	import MevBuildersView from '$/views/MevBuildersView.svelte'
</script>


<svelte:head>
	<title>MEV builders • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<MevBuildersView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builders', {
						network: params.network,
					})
				}
				title='MEV builders'
				selection={
					projection.$$mevBuilders({
						sources: [
							Source.MevRelay_Rest,
						],
					})
				}
				id='mev-builders'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
