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
		title = 'Network observations',
		typeAnnotationParagraphs = ['A point-in-time observation of network status or metrics.'],
		placeholderText = 'Loading Network observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Network_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Network_Timestamp>
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
	import Network_TimestampView from '$/views/Network_TimestampView.svelte'
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
					latestHeight: true,
					source: true,
					health: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Network_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(networkTimestamps)}
			{@const uniqueNetworkTimestamps = [...new Map(networkTimestamps.values.map((networkTimestamp) => [networkTimestamp[EntityMetaKey.SelectorKey], networkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Network_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={networkTimestamps.values.length === uniqueNetworkTimestamps.length && networkTimestamps.totalCount != null && networkTimestamps.totalCount >= uniqueNetworkTimestamps.length ? networkTimestamps.totalCount : uniqueNetworkTimestamps.length}
				getKey={(networkTimestamp) => networkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: networkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Network_Timestamp> })}
					<Network_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...networkTimestamp.entitySelector, ...networkTimestamp }).caip2.namespace)}:${String(({ ...networkTimestamp.entitySelector, ...networkTimestamp }).caip2.reference)}`,
								timestampMs: String(({ ...networkTimestamp.entitySelector, ...networkTimestamp }).timestampMs),
								source: String(({ ...networkTimestamp.entitySelector, ...networkTimestamp }).source),
							})
						}
						selection={select(EntityType.Network_Timestamp, networkTimestamp.entitySelector)}
						prefetched={networkTimestamp}
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
		entityType={EntityType.Network_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
