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
		title = 'Cardano address observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoAddress_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoAddress_Timestamp>
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
	entityType={EntityType.CardanoAddress_Timestamp}
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
				lovelaceBalance: true,
				blockSlot: true,
				transactionCount: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoAddressTimestamps) => [...new Map(cardanoAddressTimestamps.values.map((cardanoAddressTimestamp) => [cardanoAddressTimestamp[EntityMetaKey.SelectorKey], cardanoAddressTimestamp])).values()]}
	getKey={(cardanoAddressTimestamp) => cardanoAddressTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano address observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoAddressTimestamp })}
		{@const cardanoAddressTimestampFields = { ...cardanoAddressTimestamp[EntityMetaKey.Selector], ...cardanoAddressTimestamp }}
		<EntityView
			entityType={EntityType.CardanoAddress_Timestamp}
			entitySelector={cardanoAddressTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cardanoAddressTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || [String((cardanoAddressTimestampFields.blockSlot) ?? '')].filter(Boolean).join(' ') || 'Cardano address timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoAddressTimestampFields.lovelaceBalance) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cardanoAddressTimestampFields.transactionCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
