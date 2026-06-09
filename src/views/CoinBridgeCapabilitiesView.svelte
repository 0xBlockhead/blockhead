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
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityFieldReference,
		title = 'Bridge capabilities',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.CoinBridgeCapability
			>
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
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CoinBridgeCapability}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Directed edges between deployments for this coin, one row per LI.FI bridge tool.
		</p>
		<p>
			Mechanics (rail, settlement, verification, asset outcome) come from the catalog, not live quotes.
		</p>
		<p>
			For executable routes and amounts, use bridge quote flows elsewhere in the app.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No bridge capabilities yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: (
						entityFieldReference.entityType === EntityType.Coin ?
							[
								Source.Constants_Internal,
								Source.Coingecko_Rest,
							]
						:
							[
								Source.Constants_Internal,
								Source.Coingecko_Rest,
								Source.Lifi_Rest,
							]
					), fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Constants_Internal,
							Source.Lifi_Rest,
						],
					},
				} }),
			)}
			{@const capabilities = derive(
				parent,
				(parent) => {
					const coinBridgeCapabilities: readonly Entity<typeof schema, EntityType.CoinBridgeCapability>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						coinBridgeCapabilities
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.CoinBridgeCapability}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				resource={capabilities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No bridge capabilities yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<CoinBridgeCapabilityView
						entityId={envelope.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
