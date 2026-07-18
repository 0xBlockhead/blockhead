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
	import MevRelay_ProposerPayloadDeliveredsView from '$/views/MevRelay_ProposerPayloadDeliveredsView.svelte'
</script>


<svelte:head>
	<title>MEV payloads • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<MevRelay_ProposerPayloadDeliveredsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/payloads', {
						network: params.network,
					})
				}
				title='MEV payloads'
				selection={
					projection.$$mevProposerPayloadDelivered({
						sources: [
							Source.MevRelay_Rest,
						],
						count: true,
					})
				}
				id='mev-proposer-payload-delivered'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
