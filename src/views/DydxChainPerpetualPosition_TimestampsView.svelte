<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'dYdX chain perpetual position observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DydxChainPerpetualPosition_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.DydxChainPerpetualPosition_Timestamp>
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
	import DydxChainPerpetualPosition_TimestampView from '$/views/DydxChainPerpetualPosition_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					timestampMs: true,
					side: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(dydxChainPerpetualPositionTimestamps)}
			{@const uniqueDydxChainPerpetualPositionTimestamps = [...new Map(dydxChainPerpetualPositionTimestamps.values.map((dydxChainPerpetualPositionTimestamp) => [dydxChainPerpetualPositionTimestamp[EntityMetaKey.SelectorKey], dydxChainPerpetualPositionTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={dydxChainPerpetualPositionTimestamps.totalCount}
				getKey={(dydxChainPerpetualPositionTimestamp) => dydxChainPerpetualPositionTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueDydxChainPerpetualPositionTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Dydx chain perpetual position observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: dydxChainPerpetualPositionTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.DydxChainPerpetualPosition_Timestamp> })}
					{@const dydxChainPerpetualPositionTimestampFields = { ...dydxChainPerpetualPositionTimestamp[EntityMetaKey.Selector], ...dydxChainPerpetualPositionTimestamp }}
					<DydxChainPerpetualPosition_TimestampView
						selection={select(EntityType.DydxChainPerpetualPosition_Timestamp, dydxChainPerpetualPositionTimestamp[EntityMetaKey.Selector])}
						prefetched={dydxChainPerpetualPositionTimestampFields}
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
		entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
