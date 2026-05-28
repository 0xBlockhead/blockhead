<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


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
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
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
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Chainlist_Rest,
							Source.EthereumLists_Rest,
						],
					},
				},
			)}
			{@const bridges = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.EvmNetworkBridge>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
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
