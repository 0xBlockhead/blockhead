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
		title = 'ENS hub observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalEnsNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalEnsNetwork_Timestamp>
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
	import GlobalEnsNetwork_TimestampView from '$/views/_GlobalEnsNetwork_TimestampView.svelte'
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
					$hub: true,
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
				entityType={EntityType._GlobalEnsNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(globalEnsNetworkTimestamps)}
			{@const uniqueGlobalEnsNetworkTimestamps = [...new Map(globalEnsNetworkTimestamps.values.map((globalEnsNetworkTimestamp) => [globalEnsNetworkTimestamp[EntityMetaKey.SelectorKey], globalEnsNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalEnsNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalEnsNetworkTimestamps.totalCount}
				getKey={(globalEnsNetworkTimestamp) => globalEnsNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalEnsNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ENS hub observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalEnsNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalEnsNetwork_Timestamp> })}
					{@const globalEnsNetworkTimestampFields = { ...globalEnsNetworkTimestamp[EntityMetaKey.Selector], ...globalEnsNetworkTimestamp }}
					{@const globalEnsNetworkTimestampHrefFields = { ...globalEnsNetworkTimestamp, ...globalEnsNetworkTimestamp[EntityMetaKey.Selector] }}
					<GlobalEnsNetwork_TimestampView
						selection={select(EntityType._GlobalEnsNetwork_Timestamp, globalEnsNetworkTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={globalEnsNetworkTimestampFields}
						href={
							(globalEnsNetworkTimestampHrefFields.timestampMs !== undefined && globalEnsNetworkTimestampHrefFields.source !== undefined ? resolve('/(explore)/(ens)/ens/observations/[timestampMs=nonNegativeInteger]/[source]', {
								timestampMs: String(globalEnsNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(globalEnsNetworkTimestampHrefFields.source ?? ''),
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
		entityType={EntityType._GlobalEnsNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
