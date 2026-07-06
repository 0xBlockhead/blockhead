<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType._GlobalActivityPubNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalActivityPubNetwork>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const globalActivityPubNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Mastodon_Rest,
		],
	}))
	const titleFallback = $derived('global ActivityPub network')
	const viewDomId = $derived('-global-activity-pub-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import ActivityPubInstancesView from '$/views/ActivityPubInstancesView.svelte'
	import ActivityPubInstancePeersView from '$/views/ActivityPubInstancePeersView.svelte'
	import ActivityPubInstanceModeratedDomainsView from '$/views/ActivityPubInstanceModeratedDomainsView.svelte'
	import GlobalActivityPubNetwork_TimestampsView from '$/views/_GlobalActivityPubNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalActivityPubNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalActivityPubNetwork}>
			{#snippet Pending()}
				{title || 'global ActivityPub network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalActivityPubNetwork}>
			{#snippet Pending()}
				{[String((selection.entitySelector.scope ?? prefetched.scope) ?? '')].filter(Boolean).join(' ') || title || 'global ActivityPub network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.scope) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const scope = selection.entitySelector.scope ?? prefetched.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scope = resolvedEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ActivityPubActorsView
				selection={selection[EntityProxyField]<EntityType.ActivityPubActor>('$$sourceWindowActors')}
				title='Source-window actors'
				href={resolve('/(social)/(activitypub)/activitypub/actors')}
				emptyText='No ActivityPub actors in this source window.'
				id='ActivityPubActorsView-$$sourceWindowActors'
			/>

			<ActivityPubNotesView
				selection={selection[EntityProxyField]<EntityType.ActivityPubNote>('$$sourceWindowNotes')}
				title='Source-window notes'
				href={resolve('/(social)/(activitypub)/activitypub/notes')}
				emptyText='No ActivityPub notes in this source window.'
				id='ActivityPubNotesView-$$sourceWindowNotes'
			/>

			<ActivityPubInstancesView
				selection={selection[EntityProxyField]<EntityType.ActivityPubInstance>('$$instances')}
				title='Instances'
				emptyText='No ActivityPub instances configured.'
				id='ActivityPubInstancesView-$$instances'
			/>

			<ActivityPubInstancePeersView
				selection={selection[EntityProxyField]<EntityType.ActivityPubInstancePeer>('$$instancePeers')}
				title='Instance peers'
				emptyText='No ActivityPub instance peers in this source window.'
				id='ActivityPubInstancePeersView-$$instancePeers'
			/>

			<ActivityPubInstanceModeratedDomainsView
				selection={selection[EntityProxyField]<EntityType.ActivityPubInstanceModeratedDomain>('$$instanceModeratedDomains')}
				title='Instance moderated domains'
				emptyText='No ActivityPub moderated domains in this source window.'
				id='ActivityPubInstanceModeratedDomainsView-$$instanceModeratedDomains'
			/>

			<GlobalActivityPubNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType._GlobalActivityPubNetwork_Timestamp>('$$timestamps')}
				title='Timestamps'
				emptyText='No ActivityPub hub observations yet.'
				id='_GlobalActivityPubNetwork_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
