<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]',
			{ accountId: String(entityId.fid) },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'title'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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


	const connectionIdKey = $derived(
		stringify(entityId),
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
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading connection…"
		>
			{#snippet children(loadedConnection)}
				{@const headline = (
					connection.displayName
					?? loadedConnection.username
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			Persisted Blockhead link between this app and a Farcaster FID (custody or auth-address proof).
		</p>
		<p>
			Profile fields hydrate from Neynar or Snapchain; they are not on-chain identity records.
		</p>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading icon…"
		>
			{#snippet children(loadedConnection)}
				{#if (
					connection.$icon
					&& connection.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={loadedConnection.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={connection}
		>
			{#snippet children(loadedConnection)}
				{@const headline = (
					connection.displayName
					?? loadedConnection.username
					?? `FID ${String(entityId.fid)}`
				)}
				{#if loadedConnection.username !== undefined && loadedConnection.username !== headline}
					<span data-text="muted">
						@{loadedConnection.username}
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
							{#snippet children(loadedConnection)}
								{#if loadedConnection.bio != null && loadedConnection.bio !== ''}
									{loadedConnection.bio}
								{:else}
									<span data-text="muted">No profile bio is set.</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& connection.custody
			)}
				<div>
					<dt>Custody</dt>
					<dd>
						<ResourceBoundary
							resource={connection}
							placeholderText="Loading profile…"
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(loadedConnection)}
								<TruncatedValue
									value={loadedConnection.custody}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& connection.signedAt !== undefined
			)}
				<div>
					<dt>Signed in</dt>
					<dd>
						<ResourceBoundary
							resource={connection}
							placeholderText="Loading profile…"
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(loadedConnection)}
								<Timestamp
									timestamp={loadedConnection.signedAt}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
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
				sectionIdPrefix={connectionIdKey}
				sections={[
					{ id: 'feed', label: 'Farcaster feed' },
				]}
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

				{#snippet SectionFeed({ id: _feedId, label: _feedLabel })}
					<FarcasterCastsView
						href={resolve(`/farcaster/feed/user/${String(entityId.fid)}`)}
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
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>
