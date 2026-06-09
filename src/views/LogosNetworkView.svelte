<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { networkEnvironmentByEnvironment } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.Network>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const network = useEntity(entityCollectionsContext, EntityType.Network,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { name: true, environment: true, $$executionEnvironments: true, $$consensusMechanisms: true } }),
	)


	// (Derived)
	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LogosZoneView from '$/views/LogosZoneView.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	bind:open
	{layout}
>
	{#snippet Value()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				<span>{network.fields.name}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				{network.fields.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>Logos is modeled as a stack of zones and protocols rather than a single deployed public chain.</p>
	{/snippet}

	{#snippet Content()}
		<LogosZoneView
			entityId={{
				$network: entityId,
				zoneId: 'logos-stack',
			}}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={`${networkIdKey}:carousel-logos`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'logos-zones', label: 'Zones' },
				{ id: 'logos-execution', label: 'Execution' },
				{ id: 'logos-consensus', label: 'Consensus' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Topology</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLogosZones()}
				<LogosZoneView
					entityId={{
						$network: entityId,
						zoneId: 'logos-stack',
					}}
					layout={EntityLayout.SummaryDetails}
				/>
			{/snippet}

			{#snippet SectionLogosExecution()}
					<ResourceBoundary resource={network}>
						{#snippet children(network)}
							{#if (network.fields.$$executionEnvironments?.values.length ?? 0) > 0}
								<p><strong>Execution environments:</strong> {network.fields.$$executionEnvironments?.values.length ?? 0}</p>
							{/if}

							<p><strong>Environment:</strong> {networkEnvironmentByEnvironment[network.fields.environment].label}</p>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLogosConsensus()}
					<ResourceBoundary resource={network}>
						{#snippet children(network)}
							{#if (network.fields.$$consensusMechanisms?.values.length ?? 0) > 0}
								<p><strong>Consensus mechanisms:</strong> {network.fields.$$consensusMechanisms?.values.length ?? 0}</p>
							{:else}
								<p data-text="muted">No consensus mechanisms mapped for this network yet.</p>
							{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-logos-resources`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'logos-resources-faucets', label: 'Faucets' },
				{ id: 'logos-resources-block-explorers', label: 'Block explorers' },
			]}
			data-card
			class="network-view-collapsible-resources"
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLogosResourcesFaucets({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No faucets listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId,
						fieldName: '$$faucetUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}

			{#snippet SectionLogosResourcesBlockExplorers({ id, label }: { id: string, label: string })}
				<UrlsView
					CollapsibleProps={{ canToggle: false }}
					emptyText="No block explorers listed for this network yet."
					entityFieldReference={{
						entityType: EntityType.Network,
						entityId,
						fieldName: '$$blockExplorerUrls',
					}}
					fieldSources={[
						Source.Constants_Internal,
					]}
					href={href ?? ''}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
