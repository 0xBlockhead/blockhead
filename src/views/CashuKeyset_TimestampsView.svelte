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
		title = 'Cashu keyset observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CashuKeyset_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CashuKeyset_Timestamp>
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
	entityType={EntityType.CashuKeyset_Timestamp}
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
				active: true,
				inputFeePpk: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cashuKeysetTimestamps) => [...new Map(cashuKeysetTimestamps.values.map((cashuKeysetTimestamp) => [cashuKeysetTimestamp[EntityMetaKey.SelectorKey], cashuKeysetTimestamp])).values()]}
	getKey={(cashuKeysetTimestamp) => cashuKeysetTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cashu keyset observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cashuKeysetTimestamp })}
		{@const cashuKeysetTimestampFields = { ...cashuKeysetTimestamp[EntityMetaKey.Selector], ...cashuKeysetTimestamp }}
		<EntityView
			entityType={EntityType.CashuKeyset_Timestamp}
			entitySelector={cashuKeysetTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cashuKeysetTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Cashu keyset timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((cashuKeysetTimestampFields.active) ?? ''), String((cashuKeysetTimestampFields.inputFeePpk) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
