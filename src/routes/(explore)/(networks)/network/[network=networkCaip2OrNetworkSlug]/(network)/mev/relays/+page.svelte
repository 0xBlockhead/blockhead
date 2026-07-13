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
	import MevRelaysView from '$/views/MevRelaysView.svelte'
</script>


<svelte:head>
	<title>MEV relays • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<MevRelaysView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relays', {
						network: params.network,
					})
				}
				title='MEV relays'
				selection={
					projection.$$mevRelays({
						sources: [
							Source.Constants_Internal,
						],
						count: true,
					})
				}
				id='mev-relays'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
