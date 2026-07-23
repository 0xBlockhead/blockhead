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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ActivityPubActor>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.ActivityPubActor}
			entitySelector={activityPubActor[EntityMetaKey.Selector]}
			href={
				(
					activityPubActor[EntityMetaKey.Selector] != null && 'instanceOrigin' in activityPubActor[EntityMetaKey.Selector]
					&& activityPubActor[EntityMetaKey.Selector].instanceOrigin != null
					&& activityPubActor[EntityMetaKey.Selector] != null && 'localAccountId' in activityPubActor[EntityMetaKey.Selector]
					&& activityPubActor[EntityMetaKey.Selector].localAccountId != null ?
						resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
					instanceOrigin: encodeURIComponent(String(activityPubActor[EntityMetaKey.Selector].instanceOrigin ?? '')),
					localAccountId: String(activityPubActor[EntityMetaKey.Selector].localAccountId ?? ''),
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
				{[String((activityPubActorFields.displayName) ?? ''), String((activityPubActorFields.acct) ?? ''), String((activityPubActorFields.username) ?? ''), String((activityPubActorFields.localAccountId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub actor'}
			{/snippet}

			{#snippet Value()}
				{[String((activityPubActorFields.acct) ?? ''), String((activityPubActorFields.localAccountId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
