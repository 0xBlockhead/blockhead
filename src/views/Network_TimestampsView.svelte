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
		placeholderText,
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
			selection({
				fields: {
					timestampMs: true,
					latestHeight: true,
					source: true,
					health: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={networkTimestamps.totalCount}
				getKey={(networkTimestamp) => networkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: networkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Network_Timestamp> })}
					{@const networkTimestampFields = { ...networkTimestamp[EntityMetaKey.Selector], ...networkTimestamp }}
					{@const networkTimestampHrefFields = { ...networkTimestamp, ...networkTimestamp[EntityMetaKey.Selector] }}
					<Network_TimestampView
						selection={select(EntityType.Network_Timestamp, networkTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={networkTimestampFields}
						href={
							(networkTimestampHrefFields.$network !== undefined && networkTimestampHrefFields.$network.caip2 !== undefined && networkTimestampHrefFields.$network.caip2.namespace !== undefined && networkTimestampHrefFields.$network !== undefined && networkTimestampHrefFields.$network.caip2 !== undefined && networkTimestampHrefFields.$network.caip2.reference !== undefined && networkTimestampHrefFields.timestampMs !== undefined && networkTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(networkTimestampHrefFields.$network.caip2.namespace ?? '')}:${String(networkTimestampHrefFields.$network.caip2.reference ?? '')}`,
								timestampMs: String(networkTimestampHrefFields.timestampMs ?? ''),
								source: String(networkTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.Network_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
