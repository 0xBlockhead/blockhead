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
	{#snippet Icon()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading icon…"
		>
			{#snippet children(connection)}
				{#if (
					connection.$icon
					&& connection.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={connection.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(entityId.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
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

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={connection}
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			Persisted Blockhead link between this app and a Farcaster FID (custody or auth-address proof).
		</p>
		<p>
			Profile fields hydrate from Neynar or Snapchain; they are not on-chain identity records.
		</p>
		<p>
			Binds a Farcaster signer to a numeric FID so hub APIs can load custody, verifications, and casts for that identity. This is social-graph state, not wallet session keys, automated trading bots, or IPFS storage.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		{#if open}
			<ResourceBoundary
				resource={connection}
				placeholderText="Loading profile…"
			>
				{#snippet Pending()}{/snippet}
				{#snippet children(connection)}
					<p>
						{#if connection.bio != null && connection.bio !== ''}
							<TruncatedValue
								value={connection.bio}
								format={TruncatedValueFormat.Visual}
							/>
						{:else}
							<span data-text="muted">No profile bio is set.</span>
						{/if}
					</p>
				{/snippet}
			</ResourceBoundary>
		{/if}

		<dl data-column-item="center">
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

			{#if (
				open
				&& connection.signedAt !== undefined
			)}
				<div>
						<dt>Signed at</dt>
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
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
				sectionIdPrefix={connectionIdKey}
				sections={[
					{ id: 'feed', label: 'Farcaster feed' },
				]}
				id={`${connectionIdKey}:carousel-feed`}
				data-card
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Farcaster feed</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionFeed({ id: _feedId, label: _feedLabel })}
					<FarcasterCastsView
						CollapsibleProps={{ canToggle: false }}
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

	{/snippet}
</EntityView>
