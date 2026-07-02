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


	// State
	let {
		selection,
		title = 'YouTube hub observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading YouTube hub observations...',
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
	import Timestamp from '$/components/Timestamp.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					timestampMs: true,
					source: true,
				},
			}) : selection
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
				totalCount={globalYoutubeNetworkTimestamps.values.length === uniqueGlobalYoutubeNetworkTimestamps.length && globalYoutubeNetworkTimestamps.totalCount != null && globalYoutubeNetworkTimestamps.totalCount >= uniqueGlobalYoutubeNetworkTimestamps.length ? globalYoutubeNetworkTimestamps.totalCount : uniqueGlobalYoutubeNetworkTimestamps.length}
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
					<EntityView
						entityType={EntityType._GlobalYoutubeNetwork_Timestamp}
						entitySelector={globalYoutubeNetworkTimestamp.entitySelector}
						href={
							resolve('/(social)/(youtube)/youtube/observations/[timestampMs=nonNegativeInteger]/[source]', {
								timestampMs: String(({ ...globalYoutubeNetworkTimestamp.entitySelector, ...globalYoutubeNetworkTimestamp }).timestampMs),
								source: String(({ ...globalYoutubeNetworkTimestamp.entitySelector, ...globalYoutubeNetworkTimestamp }).source),
							})
						}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const timestampMs0 = ({ ...globalYoutubeNetworkTimestamp.entitySelector, ...globalYoutubeNetworkTimestamp }).timestampMs}
							<Timestamp timestamp={Number(timestampMs0)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const sourceAfter0 = ({ ...globalYoutubeNetworkTimestamp.entitySelector, ...globalYoutubeNetworkTimestamp }).source}
							{#if sourceAfter0 != null}
								<span data-text="muted">
									{String((sourceAfter0) ?? '')}
								</span>
							{/if}
						{/snippet}
					</EntityView>
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
