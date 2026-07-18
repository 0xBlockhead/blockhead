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
		title = 'ActivityPub actors',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubActors-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ActivityPubActor>
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
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubActor}
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
				$icon: true,
				displayName: true,
				acct: true,
				username: true,
				localAccountId: true,
				instanceOrigin: true,
			},
		})
	}
	getResourceItems={(activityPubActors) => [...new Map(activityPubActors.values.map((activityPubActor) => [activityPubActor[EntityMetaKey.SelectorKey], activityPubActor])).values()]}
	getKey={(activityPubActor) => activityPubActor[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub actors yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubActor })}
		{@const activityPubActorFields = { ...activityPubActor[EntityMetaKey.Selector], ...activityPubActor }}
		{@const selection = select(EntityType.ActivityPubActor, activityPubActor[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const activityPubActorHrefFields = { ...activityPubActor, ...activityPubActor[EntityMetaKey.Selector] }}
		<ActivityPubActorView
			selection={selection}
			prefetched={activityPubActorFields}
			href={
				(activityPubActorHrefFields.instanceOrigin !== undefined && activityPubActorHrefFields.localAccountId !== undefined ? resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
					instanceOrigin: encodeURIComponent(String(activityPubActorHrefFields.instanceOrigin ?? '')),
					localAccountId: String(activityPubActorHrefFields.localAccountId ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
