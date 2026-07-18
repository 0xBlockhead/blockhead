<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AtprotoActor>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
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
		{@const selection = select(EntityType.AtprotoActor, atprotoActor[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const atprotoActorHrefFields = { ...atprotoActor, ...atprotoActor[EntityMetaKey.Selector] }}
		<AtprotoActorView
			selection={selection}
			prefetched={atprotoActorFields}
			href={
				(atprotoActorHrefFields.did !== undefined ? resolve('/atproto/actor/[did=stringSegment]', {
					did: encodeURIComponent(String(atprotoActorHrefFields.did ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
