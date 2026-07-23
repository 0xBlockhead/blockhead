<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrRelay_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrRelay_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
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
	{countResource}
	getResourceItems={(nostrRelayTimestamps) => [...new Map(nostrRelayTimestamps.values.map((nostrRelayTimestamp) => [nostrRelayTimestamp[EntityMetaKey.SelectorKey], nostrRelayTimestamp])).values()]}
	getKey={(nostrRelayTimestamp) => nostrRelayTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.NostrRelay_Timestamp}
			entitySelector={nostrRelayTimestamp[EntityMetaKey.Selector]}
			href={
				(
					nostrRelayTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in nostrRelayTimestamp[EntityMetaKey.Selector]
					&& nostrRelayTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& nostrRelayTimestamp[EntityMetaKey.Selector] != null && 'source' in nostrRelayTimestamp[EntityMetaKey.Selector]
					&& nostrRelayTimestamp[EntityMetaKey.Selector].source != null
					&& nostrRelayTimestamp[EntityMetaKey.Selector] != null && '$relay' in nostrRelayTimestamp[EntityMetaKey.Selector]
					&& nostrRelayTimestamp[EntityMetaKey.Selector].$relay != null && 'relayUrl' in nostrRelayTimestamp[EntityMetaKey.Selector].$relay
					&& nostrRelayTimestamp[EntityMetaKey.Selector].$relay.relayUrl != null ?
						resolve('/nostr/relay/[relayKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(nostrRelayTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(nostrRelayTimestamp[EntityMetaKey.Selector].source ?? ''),
					relayKey: encodeURIComponent(String(nostrRelayTimestamp[EntityMetaKey.Selector].$relay.relayUrl ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((nostrRelayTimestampFields.name) ?? ''), String((nostrRelayTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'Nostr relay timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((nostrRelayTimestampFields.reachable) ?? ''), String((nostrRelayTimestampFields.software) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((nostrRelayTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
