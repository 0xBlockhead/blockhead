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
		title = 'AT Protocol hub observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading AT Protocol hub observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalAtprotoNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalAtprotoNetwork_Timestamp>
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
				entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(globalAtprotoNetworkTimestamps)}
			{@const uniqueGlobalAtprotoNetworkTimestamps = [...new Map(globalAtprotoNetworkTimestamps.values.map((globalAtprotoNetworkTimestamp) => [globalAtprotoNetworkTimestamp[EntityMetaKey.SelectorKey], globalAtprotoNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalAtprotoNetworkTimestamps.values.length === uniqueGlobalAtprotoNetworkTimestamps.length && globalAtprotoNetworkTimestamps.totalCount != null && globalAtprotoNetworkTimestamps.totalCount >= uniqueGlobalAtprotoNetworkTimestamps.length ? globalAtprotoNetworkTimestamps.totalCount : uniqueGlobalAtprotoNetworkTimestamps.length}
				getKey={(globalAtprotoNetworkTimestamp) => globalAtprotoNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalAtprotoNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AT Protocol hub observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalAtprotoNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalAtprotoNetwork_Timestamp> })}
					<EntityView
						entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
						entitySelector={globalAtprotoNetworkTimestamp.entitySelector}
						href={
							resolve('/(social)/(atproto)/atproto/observations/[timestampMs=nonNegativeInteger]/[source]', {
								timestampMs: String(({ ...globalAtprotoNetworkTimestamp.entitySelector, ...globalAtprotoNetworkTimestamp }).timestampMs),
								source: String(({ ...globalAtprotoNetworkTimestamp.entitySelector, ...globalAtprotoNetworkTimestamp }).source),
							})
						}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const timestampMs0 = ({ ...globalAtprotoNetworkTimestamp.entitySelector, ...globalAtprotoNetworkTimestamp }).timestampMs}
							<Timestamp timestamp={Number(timestampMs0)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const sourceAfter0 = ({ ...globalAtprotoNetworkTimestamp.entitySelector, ...globalAtprotoNetworkTimestamp }).source}
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
		entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
