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

	const network = useEntity(EntityType.Network, entityId, { $: [Source.Constants_Internal], name: {}, environment: {}, $$executionEnvironments: {}, $$consensusMechanisms: {} })
	const networkIdKey = $derived(stringify(entityId))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LogosZoneView from '$/views/LogosZoneView.svelte'
</script>


<EntityView entityType={EntityType.Network} {entityId} {href} bind:open {layout}>
	{#snippet Value()}<span>{entityId.namespace}:{entityId.reference}</span>{/snippet}

	{#snippet Title()}<ResourceBoundary resource={network}>{#snippet Pending()}{@render Value()}{/snippet}{#snippet children(network)}{network.name}{/snippet}</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}<p>Logos is modeled as a stack of zones and protocols rather than a single deployed public chain.</p>{/snippet}

	{#snippet Content()}<LogosZoneView entityId={{ $network: entityId, zoneId: 'logos-stack' }} layout={EntityLayout.Value} />{/snippet}

	{#snippet Details()}
		<CollapsibleTabs id={`${networkIdKey}:carousel-logos`} sectionIdPrefix={networkIdKey} sections={[{ id: 'logos-zones', label: 'Zones' }, { id: 'logos-execution', label: 'Execution' }, { id: 'logos-consensus', label: 'Consensus' }]} data-card scrollContainerProps={{ 'data-row': 'start align-start' }}>
			{#snippet Summary()}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>Topology</HeadingComponent></header>{/snippet}
			{#snippet SectionLogosZones()}<LogosZoneView entityId={{ $network: entityId, zoneId: 'logos-stack' }} layout={EntityLayout.SummaryDetails} />{/snippet}
			{#snippet SectionLogosExecution()}<ResourceBoundary resource={network}>{#snippet children(network)}<div>{#if network.$$executionEnvironments.length > 0}<p><strong>Execution:</strong> {network.$$executionEnvironments.map((environment) => environment.label).join(', ')}</p>{/if}<p><strong>Environment:</strong> {network.environment}</p></div>{/snippet}</ResourceBoundary>{/snippet}
			{#snippet SectionLogosConsensus()}<ResourceBoundary resource={network}>{#snippet children(network)}<div>{#if network.$$consensusMechanisms.length > 0}<p><strong>Consensus:</strong> {network.$$consensusMechanisms.map((mechanism) => mechanism.label).join(', ')}</p>{/if}</div>{/snippet}</ResourceBoundary>{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
