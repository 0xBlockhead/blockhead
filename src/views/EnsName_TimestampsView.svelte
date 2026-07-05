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
		title = 'ENS name observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsName_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EnsName_Timestamp>
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

				{#snippet Item({ item: ensNameTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EnsName_Timestamp> })}
					{@const ensNameTimestampFields = { ...ensNameTimestamp[EntityMetaKey.Selector], ...ensNameTimestamp }}
					{@const ensNameTimestampHrefFields = { ...ensNameTimestamp, ...ensNameTimestamp[EntityMetaKey.Selector] }}
					<EnsName_TimestampView
						selection={select(EntityType.EnsName_Timestamp, ensNameTimestamp[EntityMetaKey.Selector])}
						prefetched={ensNameTimestampFields}
						href={
							(ensNameTimestampHrefFields.$name !== undefined && ensNameTimestampHrefFields.$name.name !== undefined && ensNameTimestampHrefFields.timestampMs !== undefined && ensNameTimestampHrefFields.source !== undefined ? resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/observations/[timestampMs=nonNegativeInteger]/[source]', {
								ensName: String(ensNameTimestampHrefFields.$name.name ?? ''),
								timestampMs: String(ensNameTimestampHrefFields.timestampMs ?? ''),
								source: String(ensNameTimestampHrefFields.source ?? ''),
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
