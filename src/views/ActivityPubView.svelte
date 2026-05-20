<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { mastodonDefaultInstanceOrigin } from '$/constants/Mastodon.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'


	let {
		open = $bindable(true),
		collapsible = true,
	} = $props()

	const entityId = (
		{
			scope: 'ActivityPubNetwork' as const,
		} satisfies EntityId<typeof schema, EntityType.ActivityPubNetwork>
	)

	const networkIdKey = $derived(
		stringify(entityId),
	)

	const activityPubNetwork = useEntity(
		EntityType.ActivityPubNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			...(open ?
				{
					protocolName: {},
					homeUrl: {},
					docsUrl: {},
					$$activityPubActors: {},
					$$activityPubNotes: {},
				}
			:
				{}),
		},
	)
</script>


<EntityView
	entityType={EntityType.ActivityPubNetwork}
	{entityId}
	href={resolve('/(social)/activitypub')}
	bind:open
	title="ActivityPub / Mastodon"
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ActivityPub ties independent Mastodon-style instances into one federation: each actor id is scoped to an origin host, with WebFinger and HTTPS collections for inbox, outbox, and public keys.
		</p>
		<p>
			Directory and status rows list actors and posts the hub has already synchronized from known federated instances—not the live state of every ActivityPub server.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: _contentOpen,
	})}
		<ResourceBoundary
			resource={activityPubNetwork}
			placeholderText="Loading ActivityPub federation slice…"
		>
			{#snippet children(activityPubNetwork)}
				<dl data-column-item="center">
					{#if _contentOpen}
						<div>
							<dt>Local Mastodon cache</dt>
							<dd data-text="muted">
								{String(activityPubNetwork.$$activityPubActors?.length ?? 0)} actors · {String(activityPubNetwork.$$activityPubNotes?.length ?? 0)} statuses
							</dd>
						</div>
					{/if}

					{#if _contentOpen}
						<div>
							<dt>Protocol</dt>
							<dd>{activityPubNetwork.protocolName ?? 'ActivityPub (Mastodon-compatible)'}</dd>
						</div>
					{/if}

					{#if _contentOpen}
						{#if activityPubNetwork.homeUrl}
							<div>
								<dt>Project home</dt>
								<dd>
									<a href={activityPubNetwork.homeUrl}>{activityPubNetwork.homeUrl}</a>
								</dd>
							</div>
						{/if}
					{/if}

					{#if _contentOpen}
						{#if activityPubNetwork.docsUrl}
							<div>
								<dt>Specification</dt>
								<dd>
									<a href={activityPubNetwork.docsUrl}>
										{activityPubNetwork.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
					{/if}

					{#if _contentOpen}
						<div>
							<dt>Default Mastodon instance host</dt>
							<dd data-text="mono muted">{mastodonDefaultInstanceOrigin}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.ActivityPubNetwork}
			{entityId}
		/>

		<div
			class="activitypub-network-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-public`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 36ch',
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

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Actors"
						href={`#${networkIdKey}:public-actors`}
					>Actors</a>
					<a
						data-scroll-marker-label="Outbox"
						href={`#${networkIdKey}:public-notes`}
					>Outbox</a>
				{/snippet}

				{#snippet body(_carousel)}
					<section
						data-scroll-marker-label="Actors"
						id={`${networkIdKey}:public-actors`}
					>
						<ActivityPubActorsView
							entityFieldReference={{
								entityType: EntityType.ActivityPubNetwork,
								entityId,
								fieldName: '$$activityPubActors',
							}}
							href={resolve('/(social)/activitypub')}
							id={`${networkIdKey}:actors`}
							open={_open}
						/>
					</section>

					<section
						data-scroll-marker-label="Outbox"
						id={`${networkIdKey}:public-notes`}
					>
						<ActivityPubMastodonFieldNotes
							entityFieldReference={{
								entityType: EntityType.ActivityPubNetwork,
								entityId,
								fieldName: '$$activityPubNotes',
							}}
							fieldOpen={_open}
							href={resolve('/(social)/activitypub')}
							id={`${networkIdKey}:notes`}
							orderByCreatedAt="desc"
							placeholderText="Loading federation statuses…"
							title="Public timeline"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

<style>
	.activitypub-network-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
