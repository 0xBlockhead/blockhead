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
		entityId: EntityId<typeof schema, EntityType.SolanaNetwork>
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.SolanaNetwork,
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
	entityType={EntityType.SolanaNetwork}
	{entityId}
	{href}
	bind:open
	{layout}
>
	{#snippet Heading()}
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span>{entityId.caip2.namespace}:{entityId.caip2.reference}</span>
			{/snippet}

			{#snippet children(network)}
				{network.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>{entityId.caip2.namespace}:{entityId.caip2.reference}</span>
	{/snippet}

	{#snippet Title()}
		<span>{entityId.caip2.namespace}:{entityId.caip2.reference}</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Solana is a parallel account-based runtime using slots, leaders, SVM programs, and proof-of-history timing.
		</p>
	{/snippet}

	{#snippet Content(context)}
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

			{#if context?.open}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<div>
							<dt>Environment</dt>
							<dd>{network.environment}</dd>
						</div>

						<div>
							<dt>RPC endpoints</dt>
							<dd>{network.rpcEndpoints.length}</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-solana`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'solana-slots', label: 'Slots' },
				{ id: 'solana-execution', label: 'Execution' },
				{ id: 'solana-consensus', label: 'Consensus' },
			]}
			data-card
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
							{#if network.rpcEndpoints.length > 0}
								<div>
									<dt>RPC endpoints</dt>
									<dd>{network.rpcEndpoints.length}</dd>
								</div>
							{/if}

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

			{#snippet SectionSolanaConsensus()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<dl>
							<div>
								<dt>Consensus</dt>
								<dd>Proof of History with Tower BFT</dd>
							</div>
						</dl>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
