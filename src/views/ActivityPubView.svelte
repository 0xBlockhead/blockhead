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
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'


	const entityId = (
		{
			scope: 'ActivityPubNetwork' as const,
		} satisfies EntityId<typeof schema, EntityType.ActivityPubNetwork>
	)

	const networkIdKey = stringify(entityId)

	let open = $bindable(true)

	const activityPubNetwork = useEntity(
		EntityType.ActivityPubNetwork,
		entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			homeUrl: {},
			docsUrl: {},
			$$activityPubActors: {},
			$$activityPubNotes: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.ActivityPubNetwork}
	{entityId}
	href={resolve('/(social)/activitypub')}
	bind:open
	title="ActivityPub"
>
	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={activityPubNetwork}>
			{#snippet children(n)}
				<dl>
					<div>
						<dt>Scope</dt>
						<dd>{entityId.scope}</dd>
					</div>
					<div>
						<dt>Actors</dt>
						<dd>{String(n.$$activityPubActors.length)}</dd>
					</div>
					<div>
						<dt>Notes</dt>
						<dd>{String(n.$$activityPubNotes.length)}</dd>
					</div>
					{#if open}
						<div>
							<dt>Protocol name</dt>
							<dd>{n.protocolName ?? 'ActivityPub'}</dd>
						</div>
						{#if n.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={n.homeUrl}>{n.homeUrl}</a>
								</dd>
							</div>
						{/if}
						{#if n.docsUrl != null}
							{#if n.docsUrl !== ''}
								<div>
									<dt>Docs</dt>
									<dd>
										<a href={n.docsUrl}>
											{n.docsUrl}
										</a>
									</dd>
								</div>
							{/if}
						{/if}
						<div>
							<dt>Configured instance</dt>
							<dd>{mastodonDefaultInstanceOrigin}</dd>
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

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Public timeline
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet children({ open: _open })}
					<div
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
						style="--carousel-basis: 36ch"
					>
						<section data-scroll-marker-label="Actors">
							<ActivityPubActorsView
								entityFieldReference={{
									entityType: EntityType.ActivityPubNetwork,
									entityId,
									fieldName: '$$activityPubActors',
								}}
								href={resolve('/(social)/activitypub')}
								id={`${networkIdKey}:actors`}
								open={false}
							/>
						</section>

						<section data-scroll-marker-label="Public notes">
							<ActivityPubMastodonFieldNotes
								entityFieldReference={{
									entityType: EntityType.ActivityPubNetwork,
									entityId,
									fieldName: '$$activityPubNotes',
								}}
								href={resolve('/(social)/activitypub')}
								id={`${networkIdKey}:notes`}
								orderByCreatedAt="desc"
								placeholderText="Loading public notes…"
								title="Public notes"
							/>
						</section>
					</div>
				{/snippet}
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
