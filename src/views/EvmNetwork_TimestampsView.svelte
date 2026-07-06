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
		title = 'EVM network observations',
		typeAnnotationParagraphs = ['A point-in-time observation of an EVM-compatible network.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetwork_Timestamp>
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
	import EvmNetwork_TimestampView from '$/views/EvmNetwork_TimestampView.svelte'
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
					blockHeight: true,
					timestampMs: true,
					$network: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmNetworkTimestamps)}
			{@const uniqueEvmNetworkTimestamps = [...new Map(evmNetworkTimestamps.values.map((evmNetworkTimestamp) => [evmNetworkTimestamp[EntityMetaKey.SelectorKey], evmNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNetworkTimestamps.totalCount}
				getKey={(evmNetworkTimestamp) => evmNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmNetwork_Timestamp> })}
					{@const evmNetworkTimestampFields = { ...evmNetworkTimestamp[EntityMetaKey.Selector], ...evmNetworkTimestamp }}
					{@const evmNetworkTimestampHrefFields = { ...evmNetworkTimestamp, ...evmNetworkTimestamp[EntityMetaKey.Selector] }}
					<EvmNetwork_TimestampView
						selection={select(EntityType.EvmNetwork_Timestamp, evmNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={evmNetworkTimestampFields}
						href={
							(evmNetworkTimestampHrefFields.$network !== undefined && evmNetworkTimestampHrefFields.$network.caip2 !== undefined && evmNetworkTimestampHrefFields.$network.caip2.namespace !== undefined && evmNetworkTimestampHrefFields.$network !== undefined && evmNetworkTimestampHrefFields.$network.caip2 !== undefined && evmNetworkTimestampHrefFields.$network.caip2.reference !== undefined && evmNetworkTimestampHrefFields.timestampMs !== undefined && evmNetworkTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(evmNetworkTimestampHrefFields.$network.caip2.namespace ?? '')}:${String(evmNetworkTimestampHrefFields.$network.caip2.reference ?? '')}`,
								timestampMs: String(evmNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(evmNetworkTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
