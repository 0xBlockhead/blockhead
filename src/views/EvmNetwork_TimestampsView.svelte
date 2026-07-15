<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM network observations',
		typeAnnotationParagraphs = ['A point-in-time observation of an EVM-compatible network.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNetwork_Timestamp>
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

	const collectionSelection = $derived(selection)


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

				{#snippet Item({ item: evmNetworkTimestamp })}
					{@const evmNetworkTimestampFields = { ...evmNetworkTimestamp[EntityMetaKey.Selector], ...evmNetworkTimestamp }}
					{@const selection = select(EntityType.EvmNetwork_Timestamp, evmNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const evmNetworkTimestampHrefFields = { ...evmNetworkTimestamp, ...evmNetworkTimestamp[EntityMetaKey.Selector] }}
					<EvmNetwork_TimestampView
						selection={selection}
						prefetched={evmNetworkTimestampFields}
						href={
							(evmNetworkTimestampHrefFields.timestampMs !== undefined && evmNetworkTimestampHrefFields.source !== undefined && evmNetworkTimestampHrefFields.$network !== undefined && evmNetworkTimestampHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(evmNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(evmNetworkTimestampHrefFields.source ?? ''),
								network: String(caip2StringFromValue(evmNetworkTimestampHrefFields.$network.caip2) ?? ''),
							}) : evmNetworkTimestampHrefFields.timestampMs !== undefined && evmNetworkTimestampHrefFields.source !== undefined && evmNetworkTimestampHrefFields.$network !== undefined && evmNetworkTimestampHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(evmNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(evmNetworkTimestampHrefFields.source ?? ''),
								network: String(evmNetworkTimestampHrefFields.$network.slug ?? ''),
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
