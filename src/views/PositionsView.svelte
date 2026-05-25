<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Positions',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPosition>
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
			[entityFieldReference.fieldName]: {},
		},
	)

	const liquidityPositions = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.LiquidityPosition>[] = (
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
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.LiquidityPosition}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
	placeholderText="Loading positions…"
	resource={liquidityPositions}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Concentrated-liquidity positions: tick range, in-range liquidity, uncollected fees, and optional ERC-721 token id on a pool row.
		</p>
		<p>
			Not standalone pool contracts or generic wallet token balances.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No LP positions indexed yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		<LiquidityPositionView
			entityId={item.value[EntityMetaKey.Id]}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
