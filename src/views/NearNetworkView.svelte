<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// State
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.NearNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.NearNetwork,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			slug: {},
			name: {},
			environment: {},
			rpcEndpoints: {},
		},
	)

	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork}
	{entityId}
	{href}
	bind:open
	{layout}
>
	{#snippet Heading()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span>{entityId.networkSlug}</span>
			{/snippet}

			{#snippet children(network)}
				{network.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>{entityId.networkSlug}</span>
	{/snippet}

	{#snippet Title()}
		<span>{entityId.networkSlug}</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>NEAR models Nightshade sharding, account IDs, access keys, receipts, chunks, and execution outcomes.</p>
	{/snippet}

	{#snippet Content(context)}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<div>
						<dt>Network</dt>
						<dd>{network.slug}</dd>
					</div>

					{#if context?.open}
						<div>
							<dt>Environment</dt>
							<dd>{network.environment}</dd>
						</div>

						<div>
							<dt>RPC endpoints</dt>
							<dd>{network.rpcEndpoints.length}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-near`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'near-network', label: 'Network' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>NEAR</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNearNetwork()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<dl>
							<div>
								<dt>Environment</dt>
								<dd>{network.environment}</dd>
							</div>

							{#each network.rpcEndpoints as endpoint}
								<div>
									<dt>{endpoint.transportType}</dt>
									<dd>{endpoint.url}</dd>
								</div>
							{/each}
						</dl>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
