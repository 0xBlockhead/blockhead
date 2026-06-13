<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Pools',
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPool>
			open?: boolean
			title?: string
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.LiquidityPool}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Liquidity pools are on-chain markets where liquidity providers deposit paired assets and earn fees.
			</p>
			<p>
				Positions in a pool are tracked separately from the pool itself.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
		entityFieldReference.entityId,({ fields: {
			[entityFieldReference.fieldName]: {
				sources: [
					Source.Constants_Internal,
				],
			},
		} }),
	)}
			{@const pools = derive(
		parent,
		(parent) => {
			const liquidityPools: readonly Entity<typeof schema, EntityType.LiquidityPool>[] = (
				parent.fields[entityFieldReference.fieldName]?.values ?? []
			)
			return (
				liquidityPools.map((value) => ({
					value,
				}))
			)
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.LiquidityPool}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
				placeholderText="Loading liquidity pools…"
				resource={pools}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
						<p data-text="muted">
							No pools in this liquidityPools yet.
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
		{/if}
	{/snippet}
</EntitiesList>
