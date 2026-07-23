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
		title = 'AT Protocol account observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoActor_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AtprotoActor_Timestamp>
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
	entityType={EntityType.AtprotoActor_Timestamp}
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
				followersCount: true,
				postsCount: true,
				source: true,
				$actor: true,
			},
		})
	}
	{countResource}
	getResourceItems={(atprotoActorTimestamps) => [...new Map(atprotoActorTimestamps.values.map((atprotoActorTimestamp) => [atprotoActorTimestamp[EntityMetaKey.SelectorKey], atprotoActorTimestamp])).values()]}
	getKey={(atprotoActorTimestamp) => atprotoActorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AT Protocol account observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: atprotoActorTimestamp })}
		{@const atprotoActorTimestampFields = { ...atprotoActorTimestamp[EntityMetaKey.Selector], ...atprotoActorTimestamp }}
		<EntityView
			entityType={EntityType.AtprotoActor_Timestamp}
			entitySelector={atprotoActorTimestamp[EntityMetaKey.Selector]}
			href={
				(
					atprotoActorTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in atprotoActorTimestamp[EntityMetaKey.Selector]
					&& atprotoActorTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& atprotoActorTimestamp[EntityMetaKey.Selector] != null && 'source' in atprotoActorTimestamp[EntityMetaKey.Selector]
					&& atprotoActorTimestamp[EntityMetaKey.Selector].source != null
					&& atprotoActorTimestamp[EntityMetaKey.Selector] != null && '$actor' in atprotoActorTimestamp[EntityMetaKey.Selector]
					&& atprotoActorTimestamp[EntityMetaKey.Selector].$actor != null && 'did' in atprotoActorTimestamp[EntityMetaKey.Selector].$actor
					&& atprotoActorTimestamp[EntityMetaKey.Selector].$actor.did != null ?
						resolve('/atproto/actor/[did=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(atprotoActorTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(atprotoActorTimestamp[EntityMetaKey.Selector].source ?? ''),
					did: encodeURIComponent(String(atprotoActorTimestamp[EntityMetaKey.Selector].$actor.did ?? '')),
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
				{[String((atprotoActorTimestampFields.displayName) ?? ''), String((atprotoActorTimestampFields.handle) ?? '')].filter(Boolean).join(' ') || [String((atprotoActorTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account observation'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((atprotoActorTimestampFields.followersCount) ?? '') ? String((atprotoActorTimestampFields.followersCount) ?? '') + ' followers' : ''), (String((atprotoActorTimestampFields.postsCount) ?? '') ? String((atprotoActorTimestampFields.postsCount) ?? '') + ' posts' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
