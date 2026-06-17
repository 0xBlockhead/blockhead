<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { blockheadFarcasterConnectionAuthMethodByAuthMethod } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]',
			{ accountId: String(selector.fid) },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'title'
		>
	> = $props()

	const connection = $derived(proxy(EntityType.BlockheadFarcasterAccountConnection, selector, ({ sources: [Source.Neynar_Rest], fields: { displayName: true, username: true, $icon: true, ...(open ? ({ bio: true, custody: true, authMethod: true, signedAt: true }) : ({  })) } })))


	// (Derived)
	const connectionRow = $derived(
		connection.ready ? connection.current : undefined,
	)

	const connectionSelectorKey = $derived(
		stringify(selector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
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
	entitySelector={selector}
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
					connection.fields.$icon
					&& connection.fields.$icon[EntityMetaKey.Selector].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={connection.fields.$icon[EntityMetaKey.Selector].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(selector.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading connection…"
		>
			{#snippet children(connection)}
				{@const headline = (
					connection.fields.displayName
					?? connection.fields.username
					?? `FID ${String(selector.fid)}`
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
					connection.fields.displayName
					?? connection.fields.username
					?? `FID ${String(selector.fid)}`
				)}
				{#if connection.fields.username !== undefined && connection.fields.username !== headline}
					<span data-text="muted">
						@{connection.fields.username}
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

	{#snippet Content({})}
		{#if open}
			<ResourceBoundary
				resource={connection}
				placeholderText="Loading profile…"
			>
				{#snippet Pending()}{/snippet}
				{#snippet children(connection)}
					<p>
						{#if connection.fields.bio != null && connection.fields.bio !== ''}
							<TruncatedValue
								value={connection.fields.bio}
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
				&& connectionRow?.custody
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
									value={connection.fields.custody}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& connectionRow?.authMethod
			)}
				<div>
					<dt>Auth method</dt>
					<dd>
						<ResourceBoundary
							resource={connection}
							placeholderText="Loading profile…"
						>
							{#snippet Pending()}{/snippet}
							{#snippet children(connection)}
								{#if connection.fields.authMethod !== undefined}
									{blockheadFarcasterConnectionAuthMethodByAuthMethod[connection.fields.authMethod].label}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& connectionRow?.signedAt !== undefined
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
									timestamp={connection.fields.signedAt}
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
			sectionIdPrefix={connectionSelectorKey}
			sections={[
				{ id: 'feed', label: 'Farcaster feed' },
			]}
			id={`${connectionSelectorKey}:carousel-feed`}
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
					href={resolve('/(social)/(farcaster)/farcaster/feed/user/[userId]', {
						userId: String(selector.fid),
					})}
					entityFieldReference={{
						entityType: EntityType.FarcasterFeed,
						selector: {
							variant: 'byUser',
							fid: selector.fid,
						},
						fieldName: '$$entries',
					}}
					id={`${connectionSelectorKey}:feed-blockheadFarcasterAccountConnections`}
					title="Farcaster feed"
				/>
			{/snippet}
	</CollapsibleTabs>

	{/snippet}
</EntityView>
