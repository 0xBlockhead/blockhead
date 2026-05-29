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

	const network = useEntity(EntityType.Network, entityId, { $: [Source.Constants_Internal], name: {}, environment: {},
			$$executionEnvironments: {}, $$consensusMechanisms: {}, $$nativeAssets: {} })
	const networkIdKey = $derived(stringify(entityId))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<EntityView entityType={EntityType.Network} {entityId} {href} bind:open {layout}>
	{#snippet Value()}<span>{entityId.namespace}:{entityId.reference}</span>{/snippet}

	{#snippet Title()}<ResourceBoundary resource={network}>{#snippet Pending()}{@render Value()}{/snippet}{#snippet children(network)}{network.name}{/snippet}</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}<p>0G combines an EVM-compatible chain with DA, storage, key-value, and serving layers.</p>{/snippet}

	{#snippet Content()}<ResourceBoundary resource={network}>{#snippet children(network)}<dl><div><dt>Block</dt><dd><span data-text="muted">—</span></dd></div></dl>{/snippet}</ResourceBoundary>{/snippet}

	{#snippet Details()}
		<CollapsibleTabs id={`${networkIdKey}:carousel-0g`} sectionIdPrefix={networkIdKey} sections={[{ id: '0g-consensus', label: 'Consensus' }, { id: '0g-services', label: 'Services' }]} data-card scrollContainerProps={{ 'data-row': 'start align-start' }}>
				{#snippet Summary()}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>0G</HeadingComponent></header>{/snippet}
				{#snippet Section0gConsensus()}<ZeroGConsensusNetworkView entityId={{ $network: entityId, consensusNetworkId: '0g-chain' }} layout={EntityLayout.SummaryDetails} />{/snippet}
				{#snippet Section0gServices()}<ResourceBoundary resource={network}>{#snippet children(network)}<div>{#if network.$$executionEnvironments.length > 0}<p><strong>Execution:</strong> {network.$$executionEnvironments.map((environment) => environment.label).join(', ')}</p>{/if}{#if network.$$consensusMechanisms.length > 0}<p><strong>Consensus:</strong> {network.$$consensusMechanisms.map((mechanism) => mechanism.label).join(', ')}</p>{/if}{#if network.$$nativeAssets.length > 0}<p><strong>Native asset:</strong> {network.$$nativeAssets.map((asset) => asset.symbol).join(', ')}</p>{/if}</div>{/snippet}</ResourceBoundary>{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
