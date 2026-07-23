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
		title = 'AT Protocol accounts',
		typeAnnotationParagraphs = ['An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoActors-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AtprotoActor>
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
	entityType={EntityType.AtprotoActor}
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
				did: true,
			},
			limit: 12,
		})
	}
	{countResource}
	getResourceItems={(atprotoActors) => [...new Map(atprotoActors.values.map((atprotoActor) => [atprotoActor[EntityMetaKey.SelectorKey], atprotoActor])).values()]}
	getKey={(atprotoActor) => atprotoActor[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AT Protocol accounts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: atprotoActor })}
		{@const atprotoActorFields = { ...atprotoActor[EntityMetaKey.Selector], ...atprotoActor }}
		<EntityView
			entityType={EntityType.AtprotoActor}
			entitySelector={atprotoActor[EntityMetaKey.Selector]}
			href={
				(
					atprotoActor[EntityMetaKey.Selector] != null && 'did' in atprotoActor[EntityMetaKey.Selector]
					&& atprotoActor[EntityMetaKey.Selector].did != null ?
						resolve('/atproto/actor/[did=stringSegment]', {
					did: encodeURIComponent(String(atprotoActor[EntityMetaKey.Selector].did ?? '')),
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
				{[String((atprotoActorFields.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
