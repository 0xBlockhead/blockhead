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

			<ResourceBoundary resource={network}>
				{#snippet children(network)}
					<div>
						<dt>Environment</dt>
						<dd>{network.environment}</dd>
					</div>

					{#if context?.open}
						<div>
							<dt>RPC endpoints</dt>
							<dd>{network.rpcEndpoints.length}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
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
						<div>
							{#if network.rpcEndpoints.length > 0}
								<p><strong>RPC endpoints:</strong> {network.rpcEndpoints.length}</p>
							{/if}

							{#each network.rpcEndpoints as endpoint}
								<p><strong>{endpoint.transportType}:</strong> {endpoint.url}</p>
							{/each}
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionSolanaConsensus()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<p><strong>Consensus:</strong> Proof of History with Tower BFT</p>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
