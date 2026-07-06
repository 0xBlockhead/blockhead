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
		title = 'YouTube hub observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalYoutubeNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalYoutubeNetwork_Timestamp>
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
	import GlobalYoutubeNetwork_TimestampView from '$/views/_GlobalYoutubeNetwork_TimestampView.svelte'
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
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalYoutubeNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(globalYoutubeNetworkTimestamps)}
			{@const uniqueGlobalYoutubeNetworkTimestamps = [...new Map(globalYoutubeNetworkTimestamps.values.map((globalYoutubeNetworkTimestamp) => [globalYoutubeNetworkTimestamp[EntityMetaKey.SelectorKey], globalYoutubeNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalYoutubeNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalYoutubeNetworkTimestamps.totalCount}
				getKey={(globalYoutubeNetworkTimestamp) => globalYoutubeNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalYoutubeNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube hub observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalYoutubeNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalYoutubeNetwork_Timestamp> })}
					{@const globalYoutubeNetworkTimestampFields = { ...globalYoutubeNetworkTimestamp[EntityMetaKey.Selector], ...globalYoutubeNetworkTimestamp }}
					{@const globalYoutubeNetworkTimestampHrefFields = { ...globalYoutubeNetworkTimestamp, ...globalYoutubeNetworkTimestamp[EntityMetaKey.Selector] }}
					<GlobalYoutubeNetwork_TimestampView
						selection={select(EntityType._GlobalYoutubeNetwork_Timestamp, globalYoutubeNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={globalYoutubeNetworkTimestampFields}
						href={
							(globalYoutubeNetworkTimestampHrefFields.timestampMs !== undefined && globalYoutubeNetworkTimestampHrefFields.source !== undefined ? resolve('/(social)/(youtube)/youtube/observations/[timestampMs=nonNegativeInteger]/[source]', {
								timestampMs: String(globalYoutubeNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(globalYoutubeNetworkTimestampHrefFields.source ?? ''),
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
		entityType={EntityType._GlobalYoutubeNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
