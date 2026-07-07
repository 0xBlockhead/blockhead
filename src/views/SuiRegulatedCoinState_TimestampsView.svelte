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
		title = 'Sui regulated coin state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SuiRegulatedCoinState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SuiRegulatedCoinState_Timestamp>
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
	import SuiRegulatedCoinState_TimestampView from '$/views/SuiRegulatedCoinState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SuiRegulatedCoinState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(suiRegulatedCoinStateTimestamps)}
			{@const uniqueSuiRegulatedCoinStateTimestamps = [...new Map(suiRegulatedCoinStateTimestamps.values.map((suiRegulatedCoinStateTimestamp) => [suiRegulatedCoinStateTimestamp[EntityMetaKey.SelectorKey], suiRegulatedCoinStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SuiRegulatedCoinState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={suiRegulatedCoinStateTimestamps.totalCount}
				getKey={(suiRegulatedCoinStateTimestamp) => suiRegulatedCoinStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueSuiRegulatedCoinStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Sui regulated coin state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: suiRegulatedCoinStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SuiRegulatedCoinState_Timestamp> })}
					{@const suiRegulatedCoinStateTimestampFields = { ...suiRegulatedCoinStateTimestamp[EntityMetaKey.Selector], ...suiRegulatedCoinStateTimestamp }}
					<SuiRegulatedCoinState_TimestampView
						selection={select(EntityType.SuiRegulatedCoinState_Timestamp, suiRegulatedCoinStateTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={suiRegulatedCoinStateTimestampFields}
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
		entityType={EntityType.SuiRegulatedCoinState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
