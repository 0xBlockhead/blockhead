<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Pools',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPool>
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'body'
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'getKey'
			| 'getSortValue'
			| 'HeadingProps'
			| 'href'
			| 'id'
			| 'Item'
			| 'ItemPlaceholder'
			| 'items'
			| 'layout'
			| 'limit'
			| 'panelStyle'
			| 'placeholderKeys'
			| 'placeholderText'
			| 'resource'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Constants_Internal,
				],
			},
		},
	)

	const pools = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.LiquidityPool>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.LiquidityPool}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
	placeholderText="Loading liquidity pools…"
	resource={pools}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Liquidity pools are on-chain markets where liquidity providers deposit paired assets and earn fees.
		</p>
		<p>
			Positions in a pool are tracked separately from the pool itself.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No pools in this list yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		<LiquidityPoolView
			entityId={item.value[EntityMetaKey.Id]}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
