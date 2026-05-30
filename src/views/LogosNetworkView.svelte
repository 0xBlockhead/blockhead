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
		entityId: EntityId<typeof schema, EntityType.Network>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.Network,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			environment: {},
			$$executionEnvironments: {},
			$$consensusMechanisms: {},
		},
	)

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
				<span>{network.name}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				{network.name}
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
						{#if network.$$executionEnvironments.length > 0}
							<p><strong>Execution environments:</strong> {network.$$executionEnvironments.length}</p>
						{/if}

						<p><strong>Environment:</strong> {network.environment}</p>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLogosConsensus()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						{#if network.$$consensusMechanisms.length > 0}
							<p><strong>Consensus mechanisms:</strong> {network.$$consensusMechanisms.length}</p>
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
					limit={undefined}
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
					limit={undefined}
					id={`${id}-list`}
					title={label}
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
