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
			slug: {},
			name: {},
			environment: {},
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
		<ResourceBoundary resource={network}>
			{#snippet Pending()}
				<span data-text="muted">Resolving network...</span>
			{/snippet}

			{#snippet children(network)}
				<span>{network.slug}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>TRON models TVM contracts, blocks, witnesses, and delegated proof-of-stake state.</p>
	{/snippet}

	{#snippet Content({
		open,
	})}
		<ResourceBoundary resource={network}>
			{#snippet children(network)}
				<dl class="network-summary-head" data-column-item="center">
					<div>
						<dt>Network</dt>
						<dd>{network.slug}</dd>
					</div>

					{#if open}
						<div>
							<dt>Environment</dt>
							<dd>{network.environment}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}

		<CollapsibleTabs
			id={`${networkIdKey}:carousel-tron`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'tron-network', label: 'Network' },
			]}
			data-card
			scrollContainerProps={{
				'data-row': 'start align-start',
			}}
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>TRON</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTronNetwork()}
				<ResourceBoundary resource={network}>
					{#snippet children(network)}
						<dl>
							<div>
								<dt>Environment</dt>
								<dd>{network.environment}</dd>
							</div>
						</dl>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
