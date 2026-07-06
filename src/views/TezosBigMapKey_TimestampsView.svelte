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
		title = 'Tezos big map key observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TezosBigMapKey_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.TezosBigMapKey_Timestamp>
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
	import TezosBigMapKey_TimestampView from '$/views/TezosBigMapKey_TimestampView.svelte'
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
				entityType={EntityType.TezosBigMapKey_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(tezosBigMapKeyTimestamps)}
			{@const uniqueTezosBigMapKeyTimestamps = [...new Map(tezosBigMapKeyTimestamps.values.map((tezosBigMapKeyTimestamp) => [tezosBigMapKeyTimestamp[EntityMetaKey.SelectorKey], tezosBigMapKeyTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.TezosBigMapKey_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={tezosBigMapKeyTimestamps.totalCount}
				getKey={(tezosBigMapKeyTimestamp) => tezosBigMapKeyTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueTezosBigMapKeyTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Tezos big map key observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: tezosBigMapKeyTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.TezosBigMapKey_Timestamp> })}
					{@const tezosBigMapKeyTimestampFields = { ...tezosBigMapKeyTimestamp[EntityMetaKey.Selector], ...tezosBigMapKeyTimestamp }}
					<TezosBigMapKey_TimestampView
						selection={select(EntityType.TezosBigMapKey_Timestamp, tezosBigMapKeyTimestamp[EntityMetaKey.Selector])}
						prefetched={tezosBigMapKeyTimestampFields}
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
		entityType={EntityType.TezosBigMapKey_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
