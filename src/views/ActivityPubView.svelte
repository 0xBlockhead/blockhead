<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/activitypub'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActivityPubNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const activityPubNetwork = subscribe(EntityType.ActivityPubNetwork,
		entityId,
		({ sources: [Source.Constants_Internal], fields: { protocolName: true, registryLabel: true, ...(open ? ({ homeUrl: true, docsUrl: true, topology: true, instanceTitle: ({ sources: [Source.Mastodon_Rest] }), instanceVersion: ({ sources: [Source.Mastodon_Rest] }), fediInstanceTitle: ({ sources: [Source.Fedi_Rest] }), fediInstanceVersion: ({ sources: [Source.Fedi_Rest] }), $$activityPubActors: ({ sources: [
							Source.Constants_Internal,
							Source.Mastodon_Rest,
							Source.Fedi_Rest,
						] }), $$activityPubNotes: ({ sources: [
							Source.Mastodon_Rest,
							Source.Fedi_Rest,
						] }) }) : ({  })) } }),
	)


	// (Derived)
	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNetwork}
	{entityId}
	href={href}
	layout={EntityLayout.SummaryDetails}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="ActivityPub / Mastodon"
>
	{#snippet Value()}
		ActivityPub
	{/snippet}

	{#snippet Title()}
		ActivityPub / Mastodon
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ActivityPub is the W3C federation protocol; this hub loads Mastodon-compatible REST v1 data from configured instance hosts (public timelines and account lookups)—not direct inbox/outbox/WebFinger fetches.
		</p>
		<p>
			Actor and status activityPubNetworks come from Constants seeds plus live REST against those hosts; they are not a synchronized copy of every federated server.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubNetwork}
				placeholderText="Loading ActivityPub federation slice…"
			>
				{#snippet children(activityPubNetwork)}
					{#if activityPubNetwork.fields.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{activityPubNetwork.fields.registryLabel}</dd>
						</div>
					{:else if activityPubNetwork.fields.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{activityPubNetwork.fields.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Actors</dt>
							<dd>{String(activityPubNetwork.fields.$$activityPubActors?.values.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Statuses</dt>
							<dd>{String(activityPubNetwork.fields.$$activityPubNotes?.values.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fields.topology}
						<div>
							<dt>Topology</dt>
							<dd>{activityPubNetwork.fields.topology}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fields.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={activityPubNetwork.fields.homeUrl}>{activityPubNetwork.fields.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fields.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={activityPubNetwork.fields.docsUrl}>
									{activityPubNetwork.fields.docsUrl}
								</a>
							</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fields.instanceTitle}
						<div>
							<dt>Mastodon instance title</dt>
							<dd>{activityPubNetwork.fields.instanceTitle}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fields.instanceVersion}
						<div>
							<dt>Mastodon instance version</dt>
							<dd data-text="mono muted">{activityPubNetwork.fields.instanceVersion}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fields.fediInstanceTitle}
						<div>
							<dt>Fedi instance title</dt>
							<dd>{activityPubNetwork.fields.fediInstanceTitle}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fields.fediInstanceVersion}
						<div>
							<dt>Fedi instance version</dt>
							<dd data-text="mono muted">{activityPubNetwork.fields.fediInstanceVersion}</dd>
						</div>
					{/if}

				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${networkIdKey}:carousel-public`}
			sectionIdPrefix={networkIdKey}
			sections={[
				{ id: 'public-actors', label: 'Actors' },
				{ id: 'public-notes', label: 'Public timeline' },
			]}
			data-card
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Mastodon directory
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionPublicActors({ id: _id, label: _label })}
				<ActivityPubActorsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/activitypub/actors')}
					entityFieldReference={{
						entityType: EntityType.ActivityPubNetwork,
						entityId,
						fieldName: '$$activityPubActors',
					}}
					id={`${networkIdKey}:actors`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionPublicNotes({ id: _id, label: _label })}
				<ActivityPubNotesView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/activitypub/notes')}
					entityFieldReference={{
						entityType: EntityType.ActivityPubNetwork,
						entityId,
						fieldName: '$$activityPubNotes',
					}}
					fieldOpen={_open}
					id={`${networkIdKey}:notes`}
					orderByCreatedAt="desc"
					placeholderText="Loading federation statuses…"
					title="Public timeline"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
