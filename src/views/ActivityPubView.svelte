<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
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

	const activityPubNetwork = useEntity(
		EntityType.ActivityPubNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			registryLabel: {},
			...(open ?
				{
					homeUrl: {},
					docsUrl: {},
					topology: {},
					instanceTitle: {
						$: [Source.Mastodon_Rest],
					},
					instanceVersion: {
						$: [Source.Mastodon_Rest],
					},
					fediInstanceTitle: {
						$: [Source.Fedi_Rest],
					},
					fediInstanceVersion: {
						$: [Source.Fedi_Rest],
					},
					$$activityPubActors: {
						$: [
							Source.Constants_Internal,
							Source.Mastodon_Rest,
							Source.Fedi_Rest,
						],
					},
					$$activityPubNotes: {
						$: [
							Source.Mastodon_Rest,
							Source.Fedi_Rest,
						],
					},
				}
			:
				{}),
		},
	)


	// (Derived)
	const networkIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
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
					{#if activityPubNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{activityPubNetwork.registryLabel}</dd>
						</div>
					{:else if activityPubNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{activityPubNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Actors</dt>
							<dd>{String(activityPubNetwork.$$activityPubActors?.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Statuses</dt>
							<dd>{String(activityPubNetwork.$$activityPubNotes?.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.topology}
						<div>
							<dt>Topology</dt>
							<dd>{activityPubNetwork.topology}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={activityPubNetwork.homeUrl}>{activityPubNetwork.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={activityPubNetwork.docsUrl}>
									{activityPubNetwork.docsUrl}
								</a>
							</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.instanceTitle}
						<div>
							<dt>Mastodon instance title</dt>
							<dd>{activityPubNetwork.instanceTitle}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.instanceVersion}
						<div>
							<dt>Mastodon instance version</dt>
							<dd data-text="mono muted">{activityPubNetwork.instanceVersion}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fediInstanceTitle}
						<div>
							<dt>Fedi instance title</dt>
							<dd>{activityPubNetwork.fediInstanceTitle}</dd>
						</div>
					{/if}

					{#if open && activityPubNetwork.fediInstanceVersion}
						<div>
							<dt>Fedi instance version</dt>
							<dd data-text="mono muted">{activityPubNetwork.fediInstanceVersion}</dd>
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
