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
		title = 'AT Protocol hub observations',
		typeAnnotationParagraphs = [],
		placeholderText,
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import GlobalAtprotoNetwork_TimestampView from '$/views/_GlobalAtprotoNetwork_TimestampView.svelte'
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
				entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
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
				totalCount={globalAtprotoNetworkTimestamps.totalCount}
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
					{@const globalAtprotoNetworkTimestampFields = { ...globalAtprotoNetworkTimestamp[EntityMetaKey.Selector], ...globalAtprotoNetworkTimestamp }}
					{@const globalAtprotoNetworkTimestampHrefFields = { ...globalAtprotoNetworkTimestamp, ...globalAtprotoNetworkTimestamp[EntityMetaKey.Selector] }}
					<GlobalAtprotoNetwork_TimestampView
						selection={select(EntityType._GlobalAtprotoNetwork_Timestamp, globalAtprotoNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={globalAtprotoNetworkTimestampFields}
						href={
							(globalAtprotoNetworkTimestampHrefFields.timestampMs !== undefined && globalAtprotoNetworkTimestampHrefFields.source !== undefined ? resolve('/(social)/(atproto)/atproto/observations/[timestampMs=nonNegativeInteger]/[source]', {
								timestampMs: String(globalAtprotoNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(globalAtprotoNetworkTimestampHrefFields.source ?? ''),
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
		entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
