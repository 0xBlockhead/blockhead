<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'AT Protocol accounts',
		typeAnnotationParagraphs = ['An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoActors-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AtprotoActor>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
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
				fields: {
					$icon: true,
					displayName: true,
					handle: true,
					did: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoActor}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(atprotoActors)}
			{@const uniqueAtprotoActors = [...new Map(atprotoActors.values.map((atprotoActor) => [atprotoActor[EntityMetaKey.SelectorKey], atprotoActor])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoActor}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={atprotoActors.totalCount}
				getKey={(atprotoActor) => atprotoActor[EntityMetaKey.SelectorKey]}
				items={uniqueAtprotoActors}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AT Protocol accounts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: atprotoActor }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AtprotoActor> })}
					{@const atprotoActorFields = { ...atprotoActor[EntityMetaKey.Selector], ...atprotoActor }}
					{@const atprotoActorHrefFields = { ...atprotoActor, ...atprotoActor[EntityMetaKey.Selector] }}
					<AtprotoActorView
						selection={select(EntityType.AtprotoActor, atprotoActor[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={atprotoActorFields}
						href={
							(atprotoActorHrefFields.did !== undefined ? resolve('/atproto/actor/[did=stringSegment]', {
								did: String(atprotoActorHrefFields.did ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.AtprotoActor}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
