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

	const network = useEntity(EntityType.Network, entityId, { $: [Source.Constants_Internal], name: {}, environment: {}, $$executionEnvironments: {}, $$consensusMechanisms: {}, $$nativeAssets: {} })
	const networkIdKey = $derived(stringify(entityId))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView entityType={EntityType.Network} {entityId} {href} bind:open {layout}>
	{#snippet Heading()}<ResourceBoundary resource={network}>{#snippet Pending()}{@render Title()}{/snippet}{#snippet children(network)}{network.name}{/snippet}</ResourceBoundary>{/snippet}
	{#snippet Value()}<span>{entityId.namespace}:{entityId.reference}</span>{/snippet}
	{#snippet Title()}{@render Value()}{/snippet}
	{#snippet TypeAnnotationTooltip()}<p>Quilibrium is modeled around frames, shards, provers, accounts, and pending transactions.</p>{/snippet}
	{#snippet Content()}<ResourceBoundary resource={network}>{#snippet children(network)}<dl><div><dt>Environment</dt><dd>{network.environment}</dd></div></dl>{/snippet}</ResourceBoundary>{/snippet}
	{#snippet Details()}
		<CollapsibleTabs id={`${networkIdKey}:carousel-quilibrium`} sectionIdPrefix={networkIdKey} sections={[{ id: 'quilibrium-frames', label: 'Frames' }, { id: 'quilibrium-execution', label: 'Execution' }, { id: 'quilibrium-consensus', label: 'Consensus' }]} data-card scrollContainerProps={{ 'data-row': 'start align-start' }}>
			{#snippet Summary()}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>Execution</HeadingComponent></header>{/snippet}
			{#snippet SectionQuilibriumFrames()}<dl><div><dt>Frames</dt><dd>Frames are keyed by shard and frame number; live frame enumeration requires a node transport with shard context.</dd></div></dl>{/snippet}
			{#snippet SectionQuilibriumExecution()}<ResourceBoundary resource={network}>{#snippet children(network)}<dl>{#if network.$$executionEnvironments.length > 0}<div><dt>Execution</dt><dd>{network.$$executionEnvironments.map((environment) => environment.label).join(', ')}</dd></div>{/if}{#if network.$$nativeAssets.length > 0}<div><dt>Native asset</dt><dd>{network.$$nativeAssets.map((asset) => asset.symbol).join(', ')}</dd></div>{/if}</dl>{/snippet}</ResourceBoundary>{/snippet}
			{#snippet SectionQuilibriumConsensus()}<ResourceBoundary resource={network}>{#snippet children(network)}<dl>{#if network.$$consensusMechanisms.length > 0}<div><dt>Consensus</dt><dd>{network.$$consensusMechanisms.map((mechanism) => mechanism.label).join(', ')}</dd></div>{/if}</dl>{/snippet}</ResourceBoundary>{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
