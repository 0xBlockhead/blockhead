<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Positions',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPosition>
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
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

	const liquidityPositions = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.LiquidityPosition>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].id.localeCompare(b[EntityMetaKey.Id].id)
				))
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
	{...entitiesListRest}
	bind:open
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.LiquidityPosition}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
	placeholderKeys={new SvelteSet()}
	placeholderText="Loading positions…"
	resource={liquidityPositions}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Liquidity positions are a user’s shares and price range inside a specific automated market maker pool.
		</p>
		<p>
			They are not standalone pool contracts or generic wallet token balances.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No positions in this list yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<LiquidityPositionView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={resolve('/~/(accounts)/accounts/(positions)/position/[chainId]/[positionId]', {
					chainId: String(props.item.value[EntityMetaKey.Id].$network.chainId),
					positionId: props.item.value[EntityMetaKey.Id].id,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
