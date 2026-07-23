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
		title = 'Lens post observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensPost_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LensPost_Timestamp>
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
	entityType={EntityType.LensPost_Timestamp}
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
				$post: {
					fields: {
						text: true,
						timestamp: true,
					},
				},
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(lensPostTimestamps) => [...new Map(lensPostTimestamps.values.map((lensPostTimestamp) => [lensPostTimestamp[EntityMetaKey.SelectorKey], lensPostTimestamp])).values()]}
	getKey={(lensPostTimestamp) => lensPostTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lens post observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lensPostTimestamp })}
		{@const lensPostTimestampFields = { ...lensPostTimestamp[EntityMetaKey.Selector], ...lensPostTimestamp }}
		<EntityView
			entityType={EntityType.LensPost_Timestamp}
			entitySelector={lensPostTimestamp[EntityMetaKey.Selector]}
			href={
				(
					lensPostTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in lensPostTimestamp[EntityMetaKey.Selector]
					&& lensPostTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& lensPostTimestamp[EntityMetaKey.Selector] != null && '$post' in lensPostTimestamp[EntityMetaKey.Selector]
					&& lensPostTimestamp[EntityMetaKey.Selector].$post != null && 'id' in lensPostTimestamp[EntityMetaKey.Selector].$post
					&& lensPostTimestamp[EntityMetaKey.Selector].$post.id != null ?
						resolve('/lens/post/[postId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(lensPostTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					postId: String(lensPostTimestamp[EntityMetaKey.Selector].$post.id ?? ''),
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
				{[[String((lensPostTimestampFields.$post.text) ?? ''), String((lensPostTimestampFields.$post.id) ?? '')].filter(Boolean).join(' ') || 'Lens post'].filter(Boolean).join(' ') || 'Lens post observation'}
			{/snippet}

			{#snippet Value()}
				{[String((lensPostTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
