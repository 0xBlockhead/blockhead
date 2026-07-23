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
		title = 'Lens posts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensPosts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LensPost>
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
	entityType={EntityType.LensPost}
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
				text: true,
				id: true,
				timestamp: true,
			},
		})
	}
	{countResource}
	getResourceItems={(lensPosts) => [...new Map(lensPosts.values.map((lensPost) => [lensPost[EntityMetaKey.SelectorKey], lensPost])).values()]}
	getKey={(lensPost) => lensPost[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lens posts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lensPost })}
		{@const lensPostFields = { ...lensPost[EntityMetaKey.Selector], ...lensPost }}
		<EntityView
			entityType={EntityType.LensPost}
			entitySelector={lensPost[EntityMetaKey.Selector]}
			href={
				(
					lensPost[EntityMetaKey.Selector] != null && 'id' in lensPost[EntityMetaKey.Selector]
					&& lensPost[EntityMetaKey.Selector].id != null ?
						resolve('/lens/post/[postId=stringSegment]', {
					postId: String(lensPost[EntityMetaKey.Selector].id ?? ''),
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
				{[String((lensPostFields.text) ?? ''), String((lensPostFields.id) ?? '')].filter(Boolean).join(' ') || 'Lens post'}
			{/snippet}

			{#snippet Value()}
				{[String((lensPostFields.timestamp) ?? ''), String((lensPostFields.id) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
