<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Nostr observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalNostrNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalNostrNetwork_Timestamp>
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
	entityType={EntityType._GlobalNostrNetwork_Timestamp}
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
				timestampMs: true,
				source: true,
				reachable: true,
				observedNoteCount: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalNostrNetworkTimestamps) => [...new Map(globalNostrNetworkTimestamps.values.map((globalNostrNetworkTimestamp) => [globalNostrNetworkTimestamp[EntityMetaKey.SelectorKey], globalNostrNetworkTimestamp])).values()]}
	getKey={(globalNostrNetworkTimestamp) => globalNostrNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global Nostr network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalNostrNetworkTimestamp })}
		{@const globalNostrNetworkTimestampFields = { ...globalNostrNetworkTimestamp[EntityMetaKey.Selector], ...globalNostrNetworkTimestamp }}
		<EntityView
			entityType={EntityType._GlobalNostrNetwork_Timestamp}
			entitySelector={globalNostrNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((globalNostrNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global Nostr network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((globalNostrNetworkTimestampFields.source) ?? ''), String((globalNostrNetworkTimestampFields.reachable) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((globalNostrNetworkTimestampFields.observedNoteCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
