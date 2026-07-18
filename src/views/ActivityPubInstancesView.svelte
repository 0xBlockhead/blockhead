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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ActivityPubInstance>
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
	import ActivityPubInstanceView from '$/views/ActivityPubInstanceView.svelte'
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
		{@const selection = select(EntityType.ActivityPubInstance, activityPubInstance[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const activityPubInstanceHrefFields = { ...activityPubInstance, ...activityPubInstance[EntityMetaKey.Selector] }}
		<ActivityPubInstanceView
			selection={selection}
			prefetched={activityPubInstanceFields}
			href={
				(activityPubInstanceHrefFields.instanceOrigin !== undefined ? resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]', {
					instanceOrigin: encodeURIComponent(String(activityPubInstanceHrefFields.instanceOrigin ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
