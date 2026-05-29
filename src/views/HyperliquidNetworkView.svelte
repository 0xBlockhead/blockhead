<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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
			$: [Source.Constants_Internal],
			name: {},
			environment: {},
			$networkStack: {},
			$$nativeAssets: {},
			$$executionEnvironments: {},
			$$consensusMechanisms: {},
		},
	)

	const networkIdKey = $derived(stringify(entityId))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HyperliquidBlockView from '$/views/HyperliquidBlockView.svelte'
	import NetworkStackView from '$/views/NetworkStackView.svelte'
</script>


<EntityView entityType={EntityType.Network} {entityId} {href} bind:open {layout}>
	{#snippet Value()}<span>{entityId.namespace}:{entityId.reference}</span>{/snippet}

	{#snippet Title()}<ResourceBoundary resource={network}>{#snippet Pending()}{@render Value()}{/snippet}{#snippet children(network)}{network.name}{/snippet}</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}<p>Hyperliquid combines HyperBFT consensus, HyperCore exchange state, and HyperEVM execution.</p>{/snippet}

	{#snippet Content({
		open,
	})}
		<dl class="network-summary-head" data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd id="network-summary-head-block">
					<ResourceBoundary resource={network} placeholderText="Loading head block…">
						{#snippet children(network)}
							<span data-text="muted">—</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					{#if open}
						<div>
							<dt>Environment</dt>
							<dd>{network.environment}</dd>
						</div>
					{/if}

					{#if open && network.$networkStack != null}
						<div>
							<dt>Stack</dt>
							<dd>
								<NetworkStackView
									entityId={network.$networkStack[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
				id={`${networkIdKey}:carousel-hyperliquid`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'hyperliquid-blocks', label: 'Blocks' },
					{ id: 'hyperliquid-execution', label: 'Execution' },
					{ id: 'hyperliquid-consensus', label: 'Consensus' },
				]}
				data-card
				scrollContainerProps={{ 'data-row': 'start align-start' }}
			>
				{#snippet Summary()}<header data-row-item="flexible" data-row="wrap gap-4"><HeadingComponent>Execution</HeadingComponent></header>{/snippet}
				{#snippet SectionHyperliquidBlocks()}<ResourceBoundary resource={network} placeholderText="Loading head block…">{#snippet children(network)}<span data-text="muted">Latest head data is modeled by the dedicated block entity.</span>{/snippet}</ResourceBoundary>{/snippet}
				{#snippet SectionHyperliquidExecution()}<ResourceBoundary resource={network}>{#snippet children(network)}<div>{#if network.$$executionEnvironments.length > 0}<p><strong>Execution:</strong> {network.$$executionEnvironments.map((environment) => environment.label).join(', ')}</p>{/if}{#if network.$$nativeAssets.length > 0}<p><strong>Native asset:</strong> {network.$$nativeAssets.map((asset) => asset.symbol).join(', ')}</p>{/if}</div>{/snippet}</ResourceBoundary>{/snippet}
				{#snippet SectionHyperliquidConsensus()}<ResourceBoundary resource={network}>{#snippet children(network)}<div>{#if network.$$consensusMechanisms.length > 0}<p><strong>Consensus:</strong> {network.$$consensusMechanisms.map((mechanism) => mechanism.label).join(', ')}</p>{/if}</div>{/snippet}</ResourceBoundary>{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
