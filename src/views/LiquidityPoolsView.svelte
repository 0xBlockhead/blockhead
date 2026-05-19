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


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Liquidity pools',
		limit = 300,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPool>
			open?: boolean
			title?: string
			limit?: number
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Dexscreener_OpenApi,
						],
						limit,
					},
				}
			:
				{}
		),
	)

	const envelopes = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.LiquidityPool>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						a[EntityMetaKey.Id].id.localeCompare(b[EntityMetaKey.Id].id)
					))
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import Tooltip from '$/components/Tooltip.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.LiquidityPool}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
	resource={envelopes}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				No concentrated-liquidity pools in this slice yet.
			</p>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Each row is the shared pool curve (pair, fee, ticks, aggregate liquidity).
					</p>
					<p>
						Individual LP ranges are listed under positions, not here.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About pool rows"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<LiquidityPoolView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={resolve('/(assets)/(pools)/pool/[poolId]', {
					poolId: props.item.value[EntityMetaKey.Id].id,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
