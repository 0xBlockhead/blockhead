<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NostrProfile>
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
	import NostrProfileView from '$/views/NostrProfileView.svelte'
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
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					displayName: true,
					pubkey: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrProfile}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(nostrProfiles)}
			{@const uniqueNostrProfiles = [...new Map(nostrProfiles.values.map((nostrProfile) => [nostrProfile[EntityMetaKey.SelectorKey], nostrProfile])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrProfile}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={nostrProfiles.totalCount}
				getKey={(nostrProfile) => nostrProfile[EntityMetaKey.SelectorKey]}
				items={uniqueNostrProfiles}
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
					{@const selection = select(EntityType.NostrProfile, nostrProfile[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const nostrProfileHrefFields = { ...nostrProfile, ...nostrProfile[EntityMetaKey.Selector] }}
					<NostrProfileView
						selection={selection}
						prefetched={nostrProfileFields}
						href={
							(nostrProfileHrefFields.pubkey !== undefined ? resolve('/nostr/profile/[pubkey=stringSegment]', {
								pubkey: String(nostrProfileHrefFields.pubkey ?? ''),
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
		entityType={EntityType.NostrProfile}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
