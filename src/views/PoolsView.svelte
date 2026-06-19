<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		open = $bindable(true),
		title = 'Pools',
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LiquidityPool>
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

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={selection({
						sources: [Source.Constants_Internal],
					})}
				placeholderText="Loading liquidity pools…"
			>
				{#snippet children(pools)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LiquidityPool}
						id={`${id}-items`}
						href={href}
						{title}
						getKey={(pool) => stringify(pool.entitySelector)}
						getSortValue={(pool) => pool.entitySelector.id}
						placeholderText="Loading liquidity pools…"
						items={pools.entities}
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
							selection={select(EntityType.LiquidityPool, item.entitySelector)}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}

					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
