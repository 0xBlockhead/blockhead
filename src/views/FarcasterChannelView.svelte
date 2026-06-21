<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
			channelId: selection.entitySelector.id,
		}),
		open = $bindable(true),
			...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterChannel>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const channel = $derived(
		selection(
			({ sources: [
				Source.Farcaster_Rest,
			], fields: { name: true, description: true, $icon: true, ...(open ? ({ url: true, createdAt: true, pinnedCastHash: true, publicCasting: true, externalLinkTitle: true, externalLinkUrl: true, followedAt: true, $headerImage: true, $lead: true, $moderator: true, $$moderators: true }) : ({  })) } }),
		)
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading Farcaster channel (channel id / slug)…"
		>
			{#snippet children(channel)}
				{#if channel.$icon?.[EntityMetaKey.Selector].url}
					<IconComponent
						src={channel.$icon[EntityMetaKey.Selector].url}
						alt={channel.name ?? selection.entitySelector.id}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			/{selection.entitySelector.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading Farcaster channel (channel id / slug)…"
		>
			{#snippet children(channel)}
				{channel.name ?? `/${selection.entitySelector.id}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Topic channels group casts under a stable channel id with moderators and optional URLs.
		</p>
		<p>
			Channel feeds in this app load via a FarcasterFeed byChannel variant—not on-chain event logs.
		</p>
	{/snippet}

		{#snippet Content({})}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading Farcaster channel (channel id / slug)…"
		>
			{#snippet children(channel)}
				{#if channel.description !== undefined}
					<p>
						<TruncatedValue
							value={channel.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl>
			<div>
				<dt>Public casting</dt>
				<dd>
					<ResourceBoundary
						resource={channel}
						placeholderText="Loading Farcaster channel (channel id / slug)…"
					>
						{#snippet children(channel)}
							{#if channel.publicCasting !== undefined}
								{channel.publicCasting ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>URL</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.url !== undefined}
									<a href={channel.url}>{channel.url}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Lead</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if (
									channel.$lead !== undefined
									&& channel.$lead[EntityMetaKey.Selector].fid !== undefined
								)}
										<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId=farcasterFid]', {
										userId: String(channel.$lead[EntityMetaKey.Selector].fid),
									})}>
										FID {String(channel.$lead[EntityMetaKey.Selector].fid)}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Moderator</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if (
									channel.$moderator !== undefined
									&& channel.$moderator[EntityMetaKey.Selector].fid !== undefined
								)}
										<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId=farcasterFid]', {
										userId: String(channel.$moderator[EntityMetaKey.Selector].fid),
									})}>
										FID {String(channel.$moderator[EntityMetaKey.Selector].fid)}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Moderators</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.$$moderators?.values.length}
									<ul>
										{#each channel.$$moderators.values as mod (String(mod[EntityMetaKey.Selector].fid))}
											<li>
													<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId=farcasterFid]', {
													userId: String(mod[EntityMetaKey.Selector].fid),
												})}>
													FID {String(mod[EntityMetaKey.Selector].fid)}
												</a>
											</li>
										{/each}
									</ul>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.createdAt !== undefined}
									<Timestamp
										timestamp={channel.createdAt}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Pinned cast hash</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.pinnedCastHash !== undefined}
									<span>
										<TruncatedValue
											value={channel.pinnedCastHash}
											startLength={10}
											endLength={8}
											format={TruncatedValueFormat.Visual}
										/>
									</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>External link title</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.externalLinkTitle !== undefined}
									{channel.externalLinkTitle}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>External link URL</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.externalLinkUrl !== undefined}
									<a href={channel.externalLinkUrl}>
										{channel.externalLinkUrl}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Followed at</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.followedAt !== undefined}
									<Timestamp
										timestamp={channel.followedAt}
									/>
								{/if}
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
		{@const channelDetailKey = stringify(selection.entitySelector)}
		<CollapsibleTabs
			id={`${channelDetailKey}:carousel-channel`}
			sectionIdPrefix={channelDetailKey}
			sections={collapsibleTabsSections([
				{ id: 'channel-record', label: 'Record' },
				{ id: 'channel-banner', label: 'Banner' },
			])}
			data-card
		>
			{#snippet Summary({
				open: _summaryOpen,
			})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Channel
					</HeadingComponent>
				</header>
			{/snippet}

				{#snippet SectionChannelBanner()}
				<ResourceBoundary
					resource={channel}
					placeholderText="Loading Farcaster channel banner…"
					>
						{#snippet children(channel)}
							<section data-column>
								<h3>Channel</h3>
								{#if (
									channel.$headerImage !== undefined
									&& channel.$headerImage[EntityMetaKey.Selector].url !== undefined
								)}
									<p>
										<Media
											media={{ url: channel.$headerImage[EntityMetaKey.Selector].url }}
											fit="cover"
										/>
									</p>
								{/if}
							</section>
						{/snippet}
				</ResourceBoundary>
			{/snippet}

			</CollapsibleTabs>
		{/snippet}
	</EntityView>
