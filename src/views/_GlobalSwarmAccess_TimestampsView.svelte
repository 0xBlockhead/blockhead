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
		title = 'Global Swarm access observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalSwarmAccess_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalSwarmAccess_Timestamp>
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
	import GlobalSwarmAccess_TimestampView from '$/views/_GlobalSwarmAccess_TimestampView.svelte'
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
				entityType={EntityType._GlobalSwarmAccess_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(globalSwarmAccessTimestamps)}
			{@const uniqueGlobalSwarmAccessTimestamps = [...new Map(globalSwarmAccessTimestamps.values.map((globalSwarmAccessTimestamp) => [globalSwarmAccessTimestamp[EntityMetaKey.SelectorKey], globalSwarmAccessTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalSwarmAccess_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalSwarmAccessTimestamps.totalCount}
				getKey={(globalSwarmAccessTimestamp) => globalSwarmAccessTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalSwarmAccessTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Global Swarm access observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalSwarmAccessTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalSwarmAccess_Timestamp> })}
					{@const globalSwarmAccessTimestampFields = { ...globalSwarmAccessTimestamp[EntityMetaKey.Selector], ...globalSwarmAccessTimestamp }}
					{@const globalSwarmAccessTimestampHrefFields = { ...globalSwarmAccessTimestamp, ...globalSwarmAccessTimestamp[EntityMetaKey.Selector] }}
					<GlobalSwarmAccess_TimestampView
						selection={select(EntityType._GlobalSwarmAccess_Timestamp, globalSwarmAccessTimestamp[EntityMetaKey.Selector])}
						prefetched={globalSwarmAccessTimestampFields}
						href={
							(globalSwarmAccessTimestampHrefFields.timestampMs !== undefined && globalSwarmAccessTimestampHrefFields.source !== undefined ? resolve('/(explore)/(swarm)/swarm/access/observations/[timestampMs=nonNegativeInteger]/[source]', {
								timestampMs: String(globalSwarmAccessTimestampHrefFields.timestampMs ?? ''),
								source: String(globalSwarmAccessTimestampHrefFields.source ?? ''),
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
		entityType={EntityType._GlobalSwarmAccess_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
