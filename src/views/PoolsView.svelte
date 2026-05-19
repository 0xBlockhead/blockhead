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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Pools',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPool>
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	const parentEntity = useEntity(
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

	const envelopes = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.LiquidityPool>[] = (
				merged[entityFieldReference.fieldName] ?? []
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
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.LiquidityPool}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
	placeholderKeys={new SvelteSet()}
	placeholderText="Loading liquidity pools…"
	resource={envelopes}
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
