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
		title = 'MEV relay observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevRelay_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.MevRelay_Timestamp>
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
	import MevRelay_TimestampView from '$/views/MevRelay_TimestampView.svelte'
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
					reachable: true,
					statusCode: true,
					timestampMs: true,
					$relay: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevRelay_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(mevRelayTimestamps)}
			{@const uniqueMevRelayTimestamps = [...new Map(mevRelayTimestamps.values.map((mevRelayTimestamp) => [mevRelayTimestamp[EntityMetaKey.SelectorKey], mevRelayTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevRelay_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={mevRelayTimestamps.totalCount}
				getKey={(mevRelayTimestamp) => mevRelayTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueMevRelayTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No MEV relay observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: mevRelayTimestamp })}
					{@const mevRelayTimestampFields = { ...mevRelayTimestamp[EntityMetaKey.Selector], ...mevRelayTimestamp }}
					{@const selection = select(EntityType.MevRelay_Timestamp, mevRelayTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const mevRelayTimestampHrefFields = { ...mevRelayTimestamp, ...mevRelayTimestamp[EntityMetaKey.Selector] }}
					<MevRelay_TimestampView
						selection={selection}
						prefetched={mevRelayTimestampFields}
						href={
							(mevRelayTimestampHrefFields.timestampMs !== undefined && mevRelayTimestampHrefFields.source !== undefined && mevRelayTimestampHrefFields.$relay !== undefined && mevRelayTimestampHrefFields.$relay.host !== undefined && mevRelayTimestampHrefFields.$relay.$network !== undefined && mevRelayTimestampHrefFields.$relay.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(mevRelayTimestampHrefFields.timestampMs ?? ''),
								source: String(mevRelayTimestampHrefFields.source ?? ''),
								host: String(mevRelayTimestampHrefFields.$relay.host ?? ''),
								network: String(caip2StringFromValue(mevRelayTimestampHrefFields.$relay.$network.caip2) ?? ''),
							}) : mevRelayTimestampHrefFields.timestampMs !== undefined && mevRelayTimestampHrefFields.source !== undefined && mevRelayTimestampHrefFields.$relay !== undefined && mevRelayTimestampHrefFields.$relay.host !== undefined && mevRelayTimestampHrefFields.$relay.$network !== undefined && mevRelayTimestampHrefFields.$relay.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(mevRelayTimestampHrefFields.timestampMs ?? ''),
								source: String(mevRelayTimestampHrefFields.source ?? ''),
								host: String(mevRelayTimestampHrefFields.$relay.host ?? ''),
								network: String(mevRelayTimestampHrefFields.$relay.$network.slug ?? ''),
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
		entityType={EntityType.MevRelay_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
