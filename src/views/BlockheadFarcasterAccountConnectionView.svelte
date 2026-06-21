<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
			'/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]',
			{ accountId: String(selection.entitySelector.fid) },
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'title'
		>
	> = $props()


	const farcasterUser = $derived(
		select(EntityType.FarcasterUser, {
			fid: selection.entitySelector.fid,
		})({
			sources: [
				Source.Snapchain_Rest,
			],
			fields: {
				displayName: true,
				username: true,
				$icon: {
					sources: [
						Source.Snapchain_Rest,
					],
				},
				...(open && {
					bio: true,
				}),
			},
		})
	)

	const connectionSelectorKey = $derived(
		stringify(selection.entitySelector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading icon…"
		>
			{#snippet children(farcasterUser)}
				{#if (
					farcasterUser.$icon
					&& farcasterUser.$icon[EntityMetaKey.Selector].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={farcasterUser.$icon[EntityMetaKey.Selector].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(selection.entitySelector.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading connection…"
		>
			{#snippet children(farcasterUser)}
				{@const headline = (
					farcasterUser.displayName
					?? farcasterUser.username
					?? `FID ${String(selection.entitySelector.fid)}`
				)}
				{headline}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={farcasterUser}
		>
			{#snippet children(farcasterUser)}
				{@const headline = (
					farcasterUser.displayName
					?? farcasterUser.username
					?? `FID ${String(selection.entitySelector.fid)}`
				)}
				{#if farcasterUser.username !== undefined && farcasterUser.username !== headline}
					<span data-text="muted">
						@{farcasterUser.username}
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
				resource={farcasterUser}
				placeholderText="Loading profile…"
			>
				{#snippet Pending()}{/snippet}
				{#snippet children(farcasterUser)}
					<p>
						{#if farcasterUser.bio != null && farcasterUser.bio !== ''}
							<TruncatedValue
								value={farcasterUser.bio}
								format={TruncatedValueFormat.Visual}
							/>
						{:else}
							<span data-text="muted">No profile bio is set.</span>
						{/if}
					</p>
				{/snippet}
			</ResourceBoundary>
		{/if}

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
						href={resolve('/(social)/(farcaster)/farcaster/feed/user/[userId=farcasterFid]', {
							userId: String(selection.entitySelector.fid),
						})}
						selection={select(
						EntityType.FarcasterFeed,
						{
							variant: 'byUser',
							fid: selection.entitySelector.fid,
						}
					).$$entries}
					id={`${connectionSelectorKey}:feed-blockheadFarcasterAccountConnections`}
					title="Farcaster feed"
				/>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
