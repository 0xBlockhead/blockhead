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
		title = 'ActivityPub instance peers',
		typeAnnotationParagraphs = ['A domain that a declared ActivityPub instance reports as a known connected domain.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubInstancePeers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ActivityPubInstancePeer>
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
	entityType={EntityType.ActivityPubInstancePeer}
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
				peerDomain: true,
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
	getResourceItems={(activityPubInstancePeers) => [...new Map(activityPubInstancePeers.values.map((activityPubInstancePeer) => [activityPubInstancePeer[EntityMetaKey.SelectorKey], activityPubInstancePeer])).values()]}
	getKey={(activityPubInstancePeer) => activityPubInstancePeer[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub instance peers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubInstancePeer })}
		{@const activityPubInstancePeerFields = { ...activityPubInstancePeer[EntityMetaKey.Selector], ...activityPubInstancePeer }}
		<EntityView
			entityType={EntityType.ActivityPubInstancePeer}
			entitySelector={activityPubInstancePeer[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((activityPubInstancePeerFields.peerDomain) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance peer'}
			{/snippet}

			{#snippet Value()}
				{[[String((activityPubInstancePeerFields.$observation.title) ?? ''), String((activityPubInstancePeerFields.$observation.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance observation'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
