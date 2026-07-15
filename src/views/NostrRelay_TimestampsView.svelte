<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Relay observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrRelay_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NostrRelay_Timestamp>
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
	import NostrRelay_TimestampView from '$/views/NostrRelay_TimestampView.svelte'
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
					name: true,
					source: true,
					reachable: true,
					software: true,
					timestampMs: true,
					$relay: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrRelay_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(nostrRelayTimestamps)}
			{@const uniqueNostrRelayTimestamps = [...new Map(nostrRelayTimestamps.values.map((nostrRelayTimestamp) => [nostrRelayTimestamp[EntityMetaKey.SelectorKey], nostrRelayTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrRelay_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={nostrRelayTimestamps.totalCount}
				getKey={(nostrRelayTimestamp) => nostrRelayTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueNostrRelayTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Nostr relay observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: nostrRelayTimestamp })}
					{@const nostrRelayTimestampFields = { ...nostrRelayTimestamp[EntityMetaKey.Selector], ...nostrRelayTimestamp }}
					{@const selection = select(EntityType.NostrRelay_Timestamp, nostrRelayTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const nostrRelayTimestampHrefFields = { ...nostrRelayTimestamp, ...nostrRelayTimestamp[EntityMetaKey.Selector] }}
					<NostrRelay_TimestampView
						selection={selection}
						prefetched={nostrRelayTimestampFields}
						href={
							(nostrRelayTimestampHrefFields.timestampMs !== undefined && nostrRelayTimestampHrefFields.source !== undefined && nostrRelayTimestampHrefFields.$relay !== undefined && nostrRelayTimestampHrefFields.$relay.relayUrl !== undefined ? resolve('/nostr/relay/[relayKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(nostrRelayTimestampHrefFields.timestampMs ?? ''),
								source: String(nostrRelayTimestampHrefFields.source ?? ''),
								relayKey: String(nostrRelayTimestampHrefFields.$relay.relayUrl ?? ''),
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
		entityType={EntityType.NostrRelay_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
