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
		title = 'ActivityPub instances',
		typeAnnotationParagraphs = ['A declared Mastodon-compatible ActivityPub server observed through the shared Mastodon REST source.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubInstances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ActivityPubInstance>
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
	entityType={EntityType.ActivityPubInstance}
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
				instanceOrigin: true,
			},
		})
	}
	{countResource}
	getResourceItems={(activityPubInstances) => [...new Map(activityPubInstances.values.map((activityPubInstance) => [activityPubInstance[EntityMetaKey.SelectorKey], activityPubInstance])).values()]}
	getKey={(activityPubInstance) => activityPubInstance[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub instances yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubInstance })}
		{@const activityPubInstanceFields = { ...activityPubInstance[EntityMetaKey.Selector], ...activityPubInstance }}
		<EntityView
			entityType={EntityType.ActivityPubInstance}
			entitySelector={activityPubInstance[EntityMetaKey.Selector]}
			href={
				(
					activityPubInstance[EntityMetaKey.Selector] != null && 'instanceOrigin' in activityPubInstance[EntityMetaKey.Selector]
					&& activityPubInstance[EntityMetaKey.Selector].instanceOrigin != null ?
						resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]', {
					instanceOrigin: encodeURIComponent(String(activityPubInstance[EntityMetaKey.Selector].instanceOrigin ?? '')),
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
				{[String((activityPubInstanceFields.instanceOrigin) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
