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
		title = 'Nostr profile metadata events',
		typeAnnotationParagraphs = ['One cryptographically signed kind-0 metadata version for a stable Nostr profile.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrProfileMetadataEvents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrProfileMetadataEvent>
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
	entityType={EntityType.NostrProfileMetadataEvent}
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
				$icon: true,
				displayName: true,
				nip05: true,
				eventId: true,
				pubkey: true,
				createdAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(nostrProfileMetadataEvents) => [...new Map(nostrProfileMetadataEvents.values.map((nostrProfileMetadataEvent) => [nostrProfileMetadataEvent[EntityMetaKey.SelectorKey], nostrProfileMetadataEvent])).values()]}
	getKey={(nostrProfileMetadataEvent) => nostrProfileMetadataEvent[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr profile metadata events yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrProfileMetadataEvent })}
		{@const nostrProfileMetadataEventFields = { ...nostrProfileMetadataEvent[EntityMetaKey.Selector], ...nostrProfileMetadataEvent }}
		<EntityView
			entityType={EntityType.NostrProfileMetadataEvent}
			entitySelector={nostrProfileMetadataEvent[EntityMetaKey.Selector]}
			href={
				(
					nostrProfileMetadataEvent[EntityMetaKey.Selector] != null && 'eventId' in nostrProfileMetadataEvent[EntityMetaKey.Selector]
					&& nostrProfileMetadataEvent[EntityMetaKey.Selector].eventId != null ?
						resolve('/nostr/profile-metadata-version/[eventId=stringSegment]', {
					eventId: String(nostrProfileMetadataEvent[EntityMetaKey.Selector].eventId ?? ''),
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
				{[String((nostrProfileMetadataEventFields.displayName) ?? ''), String((nostrProfileMetadataEventFields.nip05) ?? '')].filter(Boolean).join(' ') || [String((nostrProfileMetadataEventFields.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile metadata event'}
			{/snippet}

			{#snippet Value()}
				{[String((nostrProfileMetadataEventFields.eventId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((nostrProfileMetadataEventFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
