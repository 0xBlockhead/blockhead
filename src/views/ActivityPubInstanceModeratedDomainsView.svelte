<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'ActivityPub instance moderated domains',
		typeAnnotationParagraphs = ['A domain that a declared ActivityPub instance reports in its public moderation-domain list.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubInstanceModeratedDomains-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ActivityPubInstanceModeratedDomain>
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
	entityType={EntityType.ActivityPubInstanceModeratedDomain}
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
				domain: true,
				severity: true,
				comment: true,
				$observation: {
					fields: {
						title: true,
						$instance: true,
						version: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(activityPubInstanceModeratedDomains) => [...new Map(activityPubInstanceModeratedDomains.values.map((activityPubInstanceModeratedDomain) => [activityPubInstanceModeratedDomain[EntityMetaKey.SelectorKey], activityPubInstanceModeratedDomain])).values()]}
	getKey={(activityPubInstanceModeratedDomain) => activityPubInstanceModeratedDomain[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub instance moderated domains yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubInstanceModeratedDomain })}
		{@const activityPubInstanceModeratedDomainFields = { ...activityPubInstanceModeratedDomain[EntityMetaKey.Selector], ...activityPubInstanceModeratedDomain }}
		<EntityView
			entityType={EntityType.ActivityPubInstanceModeratedDomain}
			entitySelector={activityPubInstanceModeratedDomain[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((activityPubInstanceModeratedDomainFields.domain) ?? ''), String((activityPubInstanceModeratedDomainFields.severity) ?? ''), String((activityPubInstanceModeratedDomainFields.comment) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance moderated domain'}
			{/snippet}

			{#snippet Value()}
				{[[String((activityPubInstanceModeratedDomainFields.$observation.title) ?? ''), String((activityPubInstanceModeratedDomainFields.$observation.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance observation'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
