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
		title = 'Regulated asset profile observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RegulatedAssetProfile_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RegulatedAssetProfile_Timestamp>
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
	import RegulatedAssetProfile_TimestampView from '$/views/RegulatedAssetProfile_TimestampView.svelte'
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
		{#snippet children(regulatedAssetProfileTimestamps)}
			{@const uniqueRegulatedAssetProfileTimestamps = [...new Map(regulatedAssetProfileTimestamps.values.map((regulatedAssetProfileTimestamp) => [regulatedAssetProfileTimestamp[EntityMetaKey.SelectorKey], regulatedAssetProfileTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RegulatedAssetProfile_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={regulatedAssetProfileTimestamps.totalCount}
				getKey={(regulatedAssetProfileTimestamp) => regulatedAssetProfileTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueRegulatedAssetProfileTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Regulated asset profile observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: regulatedAssetProfileTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RegulatedAssetProfile_Timestamp> })}
					{@const regulatedAssetProfileTimestampFields = { ...regulatedAssetProfileTimestamp[EntityMetaKey.Selector], ...regulatedAssetProfileTimestamp }}
					<RegulatedAssetProfile_TimestampView
						selection={select(EntityType.RegulatedAssetProfile_Timestamp, regulatedAssetProfileTimestamp[EntityMetaKey.Selector])}
						prefetched={regulatedAssetProfileTimestampFields}
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
		entityType={EntityType.RegulatedAssetProfile_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
