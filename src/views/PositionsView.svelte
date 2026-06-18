<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		open = $bindable(true),
		title = 'Positions',
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	data-entity-field-name={selection.fieldName}
	data-entity-field-parent={stringify(selection.entitySelector)}
	data-entity-field-type={selection.entityType}
	entityType={EntityType.LiquidityPosition}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Concentrated-liquidity positions: tick range, in-range liquidity, uncollected fees, and optional ERC-721 token id on a pool liquidityPosition.
			</p>
			<p>
				Not standalone pool contracts or generic wallet token balances.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading positions…"
			>
				{#snippet children(liquidityPositions)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LiquidityPosition}
						id={`${id}-items`}
						href={href}
						{title}
						getKey={(position) => stringify(position.entitySelector)}
						getSortValue={(position) => position.entitySelector.id}
						placeholderText="Loading positions…"
						items={liquidityPositions.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
						<p data-text="muted">
							No LP positions indexed yet.
						</p>
					{/snippet}

						{#snippet Item({ item })}
						<LiquidityPositionView
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
