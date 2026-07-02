<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'Nostr profiles',
		typeAnnotationParagraphs = ['A Nostr profile is replaceable kind-0 metadata keyed by a 64-character lowercase hex public key.'],
		placeholderText = 'Loading Nostr profiles...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrProfiles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrProfile>
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
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					displayName: true,
					pubkey: true,
				},
			}) : selection
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
				totalCount={nostrProfiles.values.length === uniqueNostrProfiles.length && nostrProfiles.totalCount != null && nostrProfiles.totalCount >= uniqueNostrProfiles.length ? nostrProfiles.totalCount : uniqueNostrProfiles.length}
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

				{#snippet Item({ item: nostrProfile }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.NostrProfile> })}
					<EntityView
						entityType={EntityType.NostrProfile}
						entitySelector={nostrProfile.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const displayName0 = ({ ...nostrProfile.entitySelector, ...nostrProfile }).displayName}
							{String((displayName0) ?? '')}
							{@const pubkey1 = ({ ...nostrProfile.entitySelector, ...nostrProfile }).pubkey}
							<TruncatedValue value={String(pubkey1)} />
						{/snippet}
					</EntityView>
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
