<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stringify } from 'devalue'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'

	const connectionIdKey = $derived(
		stringify(entityId),
	)
	const connection = useEntity(
		EntityType.BlockheadFarcasterAccountConnection,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.BlockheadFarcasterAccountConnection]?.map((r) => r.source)
				?? [
					Source.Neynar_Rest,
				]
			),
			displayName: {},
			username: {},
			$icon: {},
			...(open ?
				{
					bio: {},
					custody: {},
					signedAt: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading connection…"
		>
			{#snippet children(connection)}
				{@const headline = (
					connection.displayName
					?? connection.username
					?? `FID ${String(entityId.fid)}`
				)}
				{headline}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(entityId.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading icon…"
		>
			{#snippet children(connection)}
				{#if connection.$icon}
					{#if connection.$icon[EntityMetaKey.Id].url}
						<IconComponent
							shape={IconShape.Circle}
							src={connection.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
					{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={connection}
			placeholderText=""
		>
			{#snippet children(connection)}
				{@const headline = (
					connection.displayName
					?? connection.username
					?? `FID ${String(entityId.fid)}`
				)}
				{#if connection.username !== undefined && connection.username !== headline}
					<span data-text="muted">
						@{connection.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Link role</dt>
				<dd data-text="muted">
					Binds a Farcaster signer to a numeric FID so hub APIs can load custody, verifications, and casts for that identity. This is social-graph state—not wallet session keys, automated trading bots, or IPFS storage.
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Bio</dt>
					<dd>
						<ResourceBoundary
							resource={connection}
							placeholderText="Loading profile…"
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(connection)}
								{#if connection.bio != null && connection.bio !== ''}
									{connection.bio}
								{:else}
									<span data-text="muted">No profile bio is set.</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				{#if connection.custody}
					<div>
						<dt>Custody</dt>
						<dd>
							<ResourceBoundary
								resource={connection}
								placeholderText="Loading profile…"
							>
								{#snippet Pending()}{/snippet}
								{#snippet children(connection)}
									<TruncatedValue
										value={connection.custody}
										format={TruncatedValueFormat.Visual}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if open}
				{#if connection.signedAt !== undefined}
					<div>
						<dt>Signed in</dt>
						<dd>
							<ResourceBoundary
								resource={connection}
								placeholderText="Loading profile…"
							>
								{#snippet Pending()}{/snippet}
								{#snippet children(connection)}
									<Timestamp
										timestamp={connection.signedAt}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadFarcasterAccountConnection}
			{entityId}
		/>

		<div
			class="blockhead-farcaster-connection-carousel-groups"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${connectionIdKey}:carousel-feed`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Farcaster feed</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Farcaster feed"
						href={`#${connectionIdKey}:feed`}
					>Farcaster feed</a>
				{/snippet}

				{#snippet body(_childrenContext)}
					<section
						id={`${connectionIdKey}:feed`}
					>
						<FarcasterCastsView
							entityFieldReference={{
								entityType: EntityType.FarcasterFeed,
								entityId: {
									variant: 'byUser',
									fid: entityId.fid,
								},
								fieldName: '$$entries',
							}}
							id={`${connectionIdKey}:feed-list`}
							title="Farcaster feed"
							href={resolve(`/farcaster/feed/user/${String(entityId.fid)}`)}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
