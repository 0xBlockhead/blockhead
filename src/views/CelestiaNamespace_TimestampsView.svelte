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
		title = 'Celestia namespace observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CelestiaNamespace_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CelestiaNamespace_Timestamp>
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
	entityType={EntityType.CelestiaNamespace_Timestamp}
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
				height: true,
				blobCount: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(celestiaNamespaceTimestamps) => [...new Map(celestiaNamespaceTimestamps.values.map((celestiaNamespaceTimestamp) => [celestiaNamespaceTimestamp[EntityMetaKey.SelectorKey], celestiaNamespaceTimestamp])).values()]}
	getKey={(celestiaNamespaceTimestamp) => celestiaNamespaceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Celestia namespace observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: celestiaNamespaceTimestamp })}
		{@const celestiaNamespaceTimestampFields = { ...celestiaNamespaceTimestamp[EntityMetaKey.Selector], ...celestiaNamespaceTimestamp }}
		<EntityView
			entityType={EntityType.CelestiaNamespace_Timestamp}
			entitySelector={celestiaNamespaceTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((celestiaNamespaceTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'celestia namespace timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((celestiaNamespaceTimestampFields.height) ?? ''), String((celestiaNamespaceTimestampFields.blobCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((celestiaNamespaceTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
