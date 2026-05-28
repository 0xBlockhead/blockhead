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
			$: [
				Source.Constants_Internal,
			],
			name: {},
			environment: {},
			$networkStack: {},
			$$nativeAssets: {},
			$$executionEnvironments: {},
			$$consensusMechanisms: {},
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
	import NetworkStackView from '$/views/NetworkStackView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	bind:open
	{layout}
>
	{#snippet Heading()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				{@render Title()}
			{/snippet}

			{#snippet children(network)}
				{network.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>{entityId.namespace}:{entityId.reference}</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Solana is a parallel account-based runtime using slots, leaders, SVM programs, and proof-of-history timing.
		</p>
	{/snippet}

	{#snippet Content({
		open,
	})}
		<dl class="network-summary-head" data-column-item="center">
			<div>
				<dt>Slot</dt>
				<dd id="network-summary-head-block">
					<ResourceBoundary resource={network} placeholderText="Loading head slot…">
						{#snippet children(network)}
							<span data-text="muted">—</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<div>
							<dt>Environment</dt>
							<dd>{network.environment}</dd>
						</div>

						{#if network.$networkStack != null}
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
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<EntityDetails entityType={EntityType.Network} {entityId} />

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-solana`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'solana-slots', label: 'Slots' },
				{ id: 'solana-execution', label: 'Execution' },
				{ id: 'solana-consensus', label: 'Consensus' },
			]}
			{...{ 'data-card': '' }}
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Execution</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionSolanaSlots()}
				<ResourceBoundary resource={network} placeholderText="Loading head slot…">
					{#snippet children(network)}
						<span data-text="muted">Latest head data is modeled by the dedicated block entity.</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionSolanaExecution()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<dl>
							{#if network.$$executionEnvironments.length > 0}
								<div>
									<dt>Execution</dt>
									<dd>{network.$$executionEnvironments.map((environment) => environment.label).join(', ')}</dd>
								</div>
							{/if}

							{#if network.$$nativeAssets.length > 0}
								<div>
									<dt>Native asset</dt>
									<dd>{network.$$nativeAssets.map((asset) => asset.symbol).join(', ')}</dd>
								</div>
							{/if}
						</dl>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionSolanaConsensus()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<dl>
							{#if network.$$consensusMechanisms.length > 0}
								<div>
									<dt>Consensus</dt>
									<dd>{network.$$consensusMechanisms.map((mechanism) => mechanism.label).join(', ')}</dd>
								</div>
							{/if}
						</dl>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
