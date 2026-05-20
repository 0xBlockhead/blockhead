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


	// Props
	let {
		entityFieldReference,
		href,
		title = 'Bridge capabilities',
		open = $bindable(true),
		collapsible = true,
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.CoinBridgeCapability
			>
			href: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CoinBridgeCapability}
	{title}
	bind:open
	{collapsible}
	{...entitiesListProps}
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

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: (
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
					),
					[entityFieldReference.fieldName]: {
						$: [
							Source.Constants_Internal,
							Source.Lifi_Rest,
						],
					},
				},
			)}
			{@const capabilities = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.CoinBridgeCapability>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows
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
				placeholderKeys={new SvelteSet()}
				resource={capabilities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No bridge capabilities yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					{#if envelope}
						<CoinBridgeCapabilityView
							entityId={envelope.value[EntityMetaKey.Id]}
							{href}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
