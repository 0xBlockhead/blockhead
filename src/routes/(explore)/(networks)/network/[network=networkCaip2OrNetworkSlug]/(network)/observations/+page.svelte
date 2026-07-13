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
	import EvmNetwork_TimestampsView from '$/views/EvmNetwork_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Observations • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmNetwork_TimestampsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/observations', {
						network: params.network,
					})
				}
				title='Observations'
				selection={projection.$$timestamps}
				id='timestamps'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
