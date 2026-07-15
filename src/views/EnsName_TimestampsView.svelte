<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ENS name observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsName_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EnsName_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EnsName_TimestampView from '$/views/EnsName_TimestampView.svelte'
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
					$name: true,
					timestampMs: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EnsName_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(ensNameTimestamps)}
			{@const uniqueEnsNameTimestamps = [...new Map(ensNameTimestamps.values.map((ensNameTimestamp) => [ensNameTimestamp[EntityMetaKey.SelectorKey], ensNameTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EnsName_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={ensNameTimestamps.totalCount}
				getKey={(ensNameTimestamp) => ensNameTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEnsNameTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ENS name observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: ensNameTimestamp })}
					{@const ensNameTimestampFields = { ...ensNameTimestamp[EntityMetaKey.Selector], ...ensNameTimestamp }}
					{@const selection = select(EntityType.EnsName_Timestamp, ensNameTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const ensNameTimestampHrefFields = { ...ensNameTimestamp, ...ensNameTimestamp[EntityMetaKey.Selector] }}
					<EnsName_TimestampView
						selection={selection}
						prefetched={ensNameTimestampFields}
						href={
							(ensNameTimestampHrefFields.timestampMs !== undefined && ensNameTimestampHrefFields.source !== undefined && ensNameTimestampHrefFields.$name !== undefined && ensNameTimestampHrefFields.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(ensNameTimestampHrefFields.timestampMs ?? ''),
								source: String(ensNameTimestampHrefFields.source ?? ''),
								ensName: String(ensNameTimestampHrefFields.$name.name ?? ''),
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
		entityType={EntityType.EnsName_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
