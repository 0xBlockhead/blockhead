<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'LP positions',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPosition>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.LiquidityPosition}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Concentrated-liquidity positions: owner, tick range, in-range liquidity, uncollected fees, and optional ERC-721 token id on a Uniswap v3-style pool.
		</p>
		<p>
			No on-chain position indexer is wired yet; this catalog stays empty until a resolver maps wallet-held LP NFTs.
		</p>
	{/snippet}

	{#snippet Empty()}
		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				No LP positions indexed yet.
			</p>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Positions require an execution RPC or subgraph that reads NonfungiblePositionManager NFTs for connected accounts.
					</p>
					<p>
						Pool pair liquidityPositions from Dexscreener live under liquidity pools, not here.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About LP positions"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {},
				} }),
			)}
			{@const liquidityPositions = derive(
				parent,
				(parent) => {
					const liquidityPositions: readonly Entity<typeof schema, EntityType.LiquidityPosition>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						liquidityPositions.map((value) => ({
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
				entityType={EntityType.LiquidityPosition}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
				open={true}
				resource={liquidityPositions}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<div data-row="wrap align-center gap-2">
						<p data-text="muted">
							No LP positions indexed yet.
						</p>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Positions require an execution RPC or subgraph that reads NonfungiblePositionManager NFTs for connected accounts.
								</p>
								<p>
									Pool pair liquidityPositions from Dexscreener live under liquidity pools, not here.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="About LP positions"
							>ⓘ</abbr>
						</Tooltip>
					</div>
				{/snippet}

				{#snippet Item({ item })}
					<LiquidityPositionView
						entityId={item.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
