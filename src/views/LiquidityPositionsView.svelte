<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Liquidity positions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LiquidityPositions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LiquidityPosition>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Concentrated-liquidity LP positions require an on-chain position indexer; the list stays empty until one is wired.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					id: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(liquidityPositions)}
			{@const uniqueLiquidityPositions = [...new Map(liquidityPositions.values.map((liquidityPosition) => [liquidityPosition[EntityMetaKey.SelectorKey], liquidityPosition])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LiquidityPosition}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={liquidityPositions.totalCount}
				getKey={(liquidityPosition) => liquidityPosition[EntityMetaKey.SelectorKey]}
				items={uniqueLiquidityPositions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Liquidity positions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: liquidityPosition }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LiquidityPosition> })}
					{@const liquidityPositionFields = { ...liquidityPosition[EntityMetaKey.Selector], ...liquidityPosition }}
					{@const liquidityPositionHrefFields = { ...liquidityPosition, ...liquidityPosition[EntityMetaKey.Selector] }}
					<LiquidityPositionView
						selection={select(EntityType.LiquidityPosition, liquidityPosition[EntityMetaKey.Selector])}
						prefetched={liquidityPositionFields}
						href={
							(liquidityPositionHrefFields.id !== undefined ? resolve('/(assets)/position/[positionId]', {
								positionId: String(liquidityPositionHrefFields.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.LiquidityPosition}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
