<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'ActivityPub instance peers',
		typeAnnotationParagraphs = ['A domain that a configured ActivityPub instance reports as a known connected domain.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubInstancePeers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ActivityPubInstancePeer>
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
	import ActivityPubInstancePeerView from '$/views/ActivityPubInstancePeerView.svelte'
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
					peerDomain: true,
					instanceOrigin: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(activityPubInstancePeers)}
			{@const uniqueActivityPubInstancePeers = [...new Map(activityPubInstancePeers.values.map((activityPubInstancePeer) => [activityPubInstancePeer[EntityMetaKey.SelectorKey], activityPubInstancePeer])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubInstancePeer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={activityPubInstancePeers.totalCount}
				getKey={(activityPubInstancePeer) => activityPubInstancePeer[EntityMetaKey.SelectorKey]}
				items={uniqueActivityPubInstancePeers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ActivityPub instance peers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: activityPubInstancePeer }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ActivityPubInstancePeer> })}
					{@const activityPubInstancePeerFields = { ...activityPubInstancePeer[EntityMetaKey.Selector], ...activityPubInstancePeer }}
					<ActivityPubInstancePeerView
						selection={select(EntityType.ActivityPubInstancePeer, activityPubInstancePeer[EntityMetaKey.Selector])}
						prefetched={activityPubInstancePeerFields}
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
		entityType={EntityType.ActivityPubInstancePeer}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
