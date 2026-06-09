<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Constants_Internal,
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						],
					},
				} }),
			)}
			{@const bridges = derive(
				parent,
				(parent) => {
					const evmNetworkBridges: readonly Entity<typeof schema, EntityType.EvmNetworkBridge>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						evmNetworkBridges.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmNetworkBridge}
				{title}
				open={true}
				getKey={(envelope) => envelope.value[EntityMetaKey.Id].url}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].url}
				resource={bridges}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No bridges yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<EvmNetworkBridgeView
						entityId={envelope.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
