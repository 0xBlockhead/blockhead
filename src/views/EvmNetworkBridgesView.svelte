<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Bridges',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetworkBridge>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmNetworkBridge}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Registered routes between this chain and others: official or community bridge endpoints from network catalogs.
		</p>
		<p>
			Use them to pick an exit before moving funds; always verify destination support separately.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No bridges yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [Source.Chainlist_Rest, Source.EthereumLists_Rest],
					})}
				placeholderText="Loading bridges…"
			>
				{#snippet children(bridges)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetworkBridge}
				{title}
				open={true}
				getKey={(envelope) => envelope.entitySelector.url}
				getSortValue={(envelope) => envelope.entitySelector.url}
				items={bridges.entities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No bridges yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<EvmNetworkBridgeView
						selector={envelope.entitySelector}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
