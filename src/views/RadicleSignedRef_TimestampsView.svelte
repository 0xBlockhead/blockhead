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
		title = 'Radicle signed ref observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RadicleSignedRef_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RadicleSignedRef_Timestamp>
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
	import RadicleSignedRef_TimestampView from '$/views/RadicleSignedRef_TimestampView.svelte'
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
				entityType={EntityType.RadicleSignedRef_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(radicleSignedRefTimestamps)}
			{@const uniqueRadicleSignedRefTimestamps = [...new Map(radicleSignedRefTimestamps.values.map((radicleSignedRefTimestamp) => [radicleSignedRefTimestamp[EntityMetaKey.SelectorKey], radicleSignedRefTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RadicleSignedRef_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={radicleSignedRefTimestamps.totalCount}
				getKey={(radicleSignedRefTimestamp) => radicleSignedRefTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueRadicleSignedRefTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Radicle signed ref observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: radicleSignedRefTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RadicleSignedRef_Timestamp> })}
					{@const radicleSignedRefTimestampFields = { ...radicleSignedRefTimestamp[EntityMetaKey.Selector], ...radicleSignedRefTimestamp }}
					<RadicleSignedRef_TimestampView
						selection={select(EntityType.RadicleSignedRef_Timestamp, radicleSignedRefTimestamp[EntityMetaKey.Selector])}
						prefetched={radicleSignedRefTimestampFields}
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
		entityType={EntityType.RadicleSignedRef_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
