<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
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
		collapsible = true,
		title = 'Liquidity pools',
		limit = 300,
				...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			open?: boolean
			collapsible?: boolean
			title?: string
			limit?: number
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()



	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	data-entity-field-name={selection.fieldName}
	data-entity-field-parent={stringify(selection.entitySelector)}
	data-entity-field-type={selection.entityType}
	entityType={EntityType.LiquidityPool}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Dexscreener-backed concentrated-liquidity pair liquidityPools: token pair, volume, and TVL—not an exhaustive on-chain pool registry.
		</p>
		<p>
			The global catalog slice uses a fixed Dexscreener search probe (<code>WETH/USDC</code>); on-chain curve fields require another source.
		</p>
	{/snippet}

	{#snippet Empty()}
		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				No Dexscreener pair liquidityPools in this slice yet.
			</p>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Each row is a Dexscreener pair id on a supported network.
					</p>
					<p>
						Individual LP NFT ranges are listed under positions, not here.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About pool liquidityPools"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Dexscreener_OpenApi,
					],
					limit,
				})} placeholderText="Loading liquidity pools…">
				{#snippet children(liquidityPools)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						data-entity-field-name={selection.fieldName}
						data-entity-field-parent={stringify(selection.entitySelector)}
						data-entity-field-type={selection.entityType}
						entityType={EntityType.LiquidityPool}
						getKey={(liquidityPool) => stringify(liquidityPool.entitySelector)}
						getSortValue={(liquidityPool) => liquidityPool.entitySelector.id}
						open={true}
						items={liquidityPools.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">No Dexscreener pair liquidityPools in this slice yet.</p>
						{/snippet}

						{#snippet Item({ item })}
							<LiquidityPoolView
							selector={item.entitySelector}
							layout={EntityLayout.Summary}

						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
