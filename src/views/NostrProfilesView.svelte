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
		title = 'Nostr profiles',
		typeAnnotationParagraphs = ['A Nostr profile is replaceable kind-0 metadata keyed by a 64-character lowercase hex public key.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrProfiles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrProfile>
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
	entityType={EntityType.NostrProfile}
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
				pubkey: true,
			},
		})
	}
	{countResource}
	getResourceItems={(nostrProfiles) => [...new Map(nostrProfiles.values.map((nostrProfile) => [nostrProfile[EntityMetaKey.SelectorKey], nostrProfile])).values()]}
	getKey={(nostrProfile) => nostrProfile[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr profiles yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrProfile })}
		{@const nostrProfileFields = { ...nostrProfile[EntityMetaKey.Selector], ...nostrProfile }}
		<EntityView
			entityType={EntityType.NostrProfile}
			entitySelector={nostrProfile[EntityMetaKey.Selector]}
			href={
				(
					nostrProfile[EntityMetaKey.Selector] != null && 'pubkey' in nostrProfile[EntityMetaKey.Selector]
					&& nostrProfile[EntityMetaKey.Selector].pubkey != null ?
						resolve('/nostr/profile/[pubkey=stringSegment]', {
					pubkey: String(nostrProfile[EntityMetaKey.Selector].pubkey ?? ''),
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
				{[[String((nostrProfileFields.$latestMetadataEvent.displayName) ?? ''), String((nostrProfileFields.$latestMetadataEvent.nip05) ?? '')].filter(Boolean).join(' ') || [String((nostrProfileFields.$latestMetadataEvent.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile metadata event'].filter(Boolean).join(' ') || [String((nostrProfileFields.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
