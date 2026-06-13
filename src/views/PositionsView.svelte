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
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Positions',
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPosition>
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
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
	data-entity-field-type={entityFieldReference.entityType}
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
				entityType={EntityType.LiquidityPosition}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
				placeholderText="Loading positions…"
				resource={liquidityPositions}
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
							entityId={item.value[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
