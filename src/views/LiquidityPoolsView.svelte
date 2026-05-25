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
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		collapsible = true,
		title = 'Liquidity pools',
		limit = 300,
				...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPool>
			open?: boolean
			title?: string
			limit?: number
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.LiquidityPool}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Dexscreener-backed concentrated-liquidity pair rows: token pair, volume, and TVL—not an exhaustive on-chain pool registry.
		</p>
		<p>
			The global catalog slice uses a fixed Dexscreener search probe (<code>WETH/USDC</code>); on-chain curve fields require another source.
		</p>
	{/snippet}

	{#snippet Empty()}
		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				No Dexscreener pair rows in this slice yet.
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
					aria-label="About pool rows"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Dexscreener_OpenApi,
						],
						limit,
					},
				},
			)}
			{@const liquidityPools = derive(
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
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				data-entity-field-name={entityFieldReference.fieldName}
				data-entity-field-parent={stringify(entityFieldReference.entityId)}
				data-entity-field-type={entityFieldReference.entityType}
				entityType={EntityType.LiquidityPool}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
				open={true}
				resource={liquidityPools}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<div data-row="wrap align-center gap-2">
						<p data-text="muted">
							No Dexscreener pair rows in this slice yet.
						</p>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Each row is a Dexscreener pair id on a supported network (token pair, volume, TVL).
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
