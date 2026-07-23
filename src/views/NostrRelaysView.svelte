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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Nostr relays',
		typeAnnotationParagraphs = ['A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrRelays-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrRelay>
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
	entityType={EntityType.NostrRelay}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Constants_Internal,
			],
			fields: {
				relayUrl: true,
			},
		})
	}
	{countResource}
	getResourceItems={(nostrRelays) => [...new Map(nostrRelays.values.map((nostrRelay) => [nostrRelay[EntityMetaKey.SelectorKey], nostrRelay])).values()]}
	getKey={(nostrRelay) => nostrRelay[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr relays yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrRelay })}
		{@const nostrRelayFields = { ...nostrRelay[EntityMetaKey.Selector], ...nostrRelay }}
		<EntityView
			entityType={EntityType.NostrRelay}
			entitySelector={nostrRelay[EntityMetaKey.Selector]}
			href={
				(
					nostrRelay[EntityMetaKey.Selector] != null && 'relayUrl' in nostrRelay[EntityMetaKey.Selector]
					&& nostrRelay[EntityMetaKey.Selector].relayUrl != null ?
						resolve('/nostr/relay/[relayKey=stringSegment]', {
					relayKey: encodeURIComponent(String(nostrRelay[EntityMetaKey.Selector].relayUrl ?? '')),
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
				{[String((nostrRelayFields.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
