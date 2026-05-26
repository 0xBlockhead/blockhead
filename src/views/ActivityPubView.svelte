<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { mastodonDefaultInstanceOrigin } from '$/constants/Mastodon.ts'
	import { fediDefaultInstanceOrigin } from '$/constants/Fedi.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
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
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
					instanceDescription: {
						$: [Source.Mastodon_Rest],
					},
					instanceVersion: {
						$: [Source.Mastodon_Rest],
					},
					fediInstanceTitle: {
						$: [Source.Fedi_Rest],
					},
					fediInstanceDescription: {
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
		{entityId.scope}
	{/snippet}

	{#snippet Title()}
		ActivityPub / Mastodon
	{/snippet}

	{#snippet Heading()}
		{@render Title()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ActivityPub is the W3C federation protocol; this hub loads Mastodon-compatible REST v1 data from configured instance hosts (public timelines and account lookups)—not direct inbox/outbox/WebFinger fetches.
		</p>
		<p>
			Actor and status rows come from Constants seeds plus live REST against those hosts; they are not a synchronized copy of every federated server.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubNetwork}
				placeholderText="Loading ActivityPub federation slice…"
			>
				{#snippet children(loadedActivityPubNetwork)}
					{#if loadedActivityPubNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{loadedActivityPubNetwork.registryLabel}</dd>
						</div>
					{:else if loadedActivityPubNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{loadedActivityPubNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Actors</dt>
							<dd>{String(activityPubNetwork.$$activityPubActors?.length ?? 0)}</dd>
						</div>
						<div>
							<dt>Statuses</dt>
							<dd>{String(activityPubNetwork.$$activityPubNotes?.length ?? 0)}</dd>
						</div>

						{#if loadedActivityPubNetwork.topology}
							<div>
								<dt>Topology</dt>
								<dd>{loadedActivityPubNetwork.topology}</dd>
							</div>
						{/if}

						{#if loadedActivityPubNetwork.homeUrl}
							<div>
								<dt>Project home</dt>
								<dd>
									<a href={loadedActivityPubNetwork.homeUrl}>{loadedActivityPubNetwork.homeUrl}</a>
								</dd>
							</div>
						{/if}

						{#if loadedActivityPubNetwork.docsUrl}
							<div>
								<dt>Specification</dt>
								<dd>
									<a href={loadedActivityPubNetwork.docsUrl}>
										{loadedActivityPubNetwork.docsUrl}
									</a>
								</dd>
							</div>
						{/if}

						{#if loadedActivityPubNetwork.instanceTitle}
							<div>
								<dt>Mastodon instance title</dt>
								<dd>{loadedActivityPubNetwork.instanceTitle}</dd>
							</div>
						{/if}

						{#if loadedActivityPubNetwork.instanceDescription}
							<div>
								<dt>Mastodon instance description</dt>
								<dd>{loadedActivityPubNetwork.instanceDescription}</dd>
							</div>
						{/if}

						{#if loadedActivityPubNetwork.instanceVersion}
							<div>
								<dt>Mastodon instance version</dt>
								<dd data-text="mono muted">{loadedActivityPubNetwork.instanceVersion}</dd>
							</div>
						{/if}

						{#if loadedActivityPubNetwork.fediInstanceTitle}
							<div>
								<dt>Fedi instance title</dt>
								<dd>{loadedActivityPubNetwork.fediInstanceTitle}</dd>
							</div>
						{/if}

						{#if loadedActivityPubNetwork.fediInstanceDescription}
							<div>
								<dt>Fedi instance description</dt>
								<dd>{loadedActivityPubNetwork.fediInstanceDescription}</dd>
							</div>
						{/if}

						{#if loadedActivityPubNetwork.fediInstanceVersion}
							<div>
								<dt>Fedi instance version</dt>
								<dd data-text="mono muted">{loadedActivityPubNetwork.fediInstanceVersion}</dd>
							</div>
						{/if}

						<div>
							<dt>Default Mastodon instance host</dt>
							<dd data-text="mono muted">{mastodonDefaultInstanceOrigin}</dd>
						</div>

						<div>
							<dt>Default Fedi instance host</dt>
							<dd data-text="mono muted">{fediDefaultInstanceOrigin}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.ActivityPubNetwork}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels activitypub-network-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-public`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'public-actors', label: 'Actors' },
					{ id: 'public-notes', label: 'Public timeline' },
				]}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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
		</div>
	{/snippet}
</EntityView>
