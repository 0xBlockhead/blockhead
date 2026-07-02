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
		placeholderText = 'Loading EVM network observations...',
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
			selection.sources == null ? selection({
				fields: {
					blockHeight: true,
					timestampMs: true,
					$network: true,
				},
			}) : selection
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
				totalCount={evmNetworkTimestamps.values.length === uniqueEvmNetworkTimestamps.length && evmNetworkTimestamps.totalCount != null && evmNetworkTimestamps.totalCount >= uniqueEvmNetworkTimestamps.length ? evmNetworkTimestamps.totalCount : uniqueEvmNetworkTimestamps.length}
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
					<EvmNetwork_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...evmNetworkTimestamp.entitySelector, ...evmNetworkTimestamp }).caip2.namespace)}:${String(({ ...evmNetworkTimestamp.entitySelector, ...evmNetworkTimestamp }).caip2.reference)}`,
								timestampMs: String(({ ...evmNetworkTimestamp.entitySelector, ...evmNetworkTimestamp }).timestampMs),
								source: String(({ ...evmNetworkTimestamp.entitySelector, ...evmNetworkTimestamp }).source),
							})
						}
						selection={select(EntityType.EvmNetwork_Timestamp, evmNetworkTimestamp.entitySelector)}
						prefetched={evmNetworkTimestamp}
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
		entityType={EntityType.EvmNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
