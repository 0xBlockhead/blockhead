<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href,
		variant = 'hub',
		open = $bindable(true),
			...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterCast>
			href?: string
			variant?: 'feed' | 'hub'
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const supportsSnapchainCast = $derived(
		'fid' in selection.entitySelector
		&& 'hash' in selection.entitySelector
	)


	const cast = $derived(
		selection(
			{
				sources: [
					...(supportsSnapchainCast ? [Source.Snapchain_Rest] : []),
					...(!supportsSnapchainCast ? [Source.Farcaster_Rest] : []),
				],
				fields: {
					fid: true,
					hash: true,
					text: true,
					timestamp: true,
					...(!supportsSnapchainCast && {
						username: true,
						hashPrefix: true,
						clientUrl: true,
						threadHash: true,
					}),
				},
			},
		)
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	entitySelector={selection.entitySelector}
		href={href ?? (
			'fid' in selection.entitySelector && 'hash' in selection.entitySelector ?
				resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid=farcasterFid]/[hash]', {
					fid: String(selection.entitySelector.fid),
					hash: selection.entitySelector.hash,
				})
		: 'username' in selection.entitySelector && 'hashPrefix' in selection.entitySelector ?
			resolve('/(social)/(farcaster)/farcaster/(feed)/c/[fname]/[hash]', {
				fname: selection.entitySelector.username,
				hash: selection.entitySelector.hashPrefix,
			})
		: 'clientUrl' in selection.entitySelector ?
			resolve('/(social)/(farcaster)/farcaster/open-cast')
		:
			undefined
	)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		{#if variant === 'feed' && open}
			<ResourceBoundary
				resource={cast}
				placeholderText="Loading Farcaster cast (author FID + cast hash)…"
			>
				{#snippet children(cast)}
					{@const loadedCast = cast}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={
				'fid' in selection.entitySelector && 'hash' in selection.entitySelector ?
					`FID ${String(selection.entitySelector.fid)} / ${selection.entitySelector.hash}`
				: 'username' in selection.entitySelector && 'hashPrefix' in selection.entitySelector ?
					`@${selection.entitySelector.username} / ${selection.entitySelector.hashPrefix}`
				: 'clientUrl' in selection.entitySelector ?
					selection.entitySelector.clientUrl
				:
					stringify(selection.entitySelector)
			}
			startLength={18}
			endLength={10}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{#if open}
			<ResourceBoundary
				resource={cast}
				placeholderText="Loading Farcaster cast (author FID + cast hash)…"
			>
				{#snippet children(cast)}
					{@const castText = cast.fields.text?.replaceAll('\n', ' ') ?? ''}
					<TruncatedValue
						value={
							castText === '' ?
								'Cast'
							:
								castText
						}
						startLength={56}
						endLength={24}
						format={TruncatedValueFormat.Abbr}
					/>
				{/snippet}
			</ResourceBoundary>
		{:else}
			<TruncatedValue
				value={
					'fid' in selection.entitySelector && 'hash' in selection.entitySelector ?
						`Cast ${selection.entitySelector.hash}`
					: 'username' in selection.entitySelector && 'hashPrefix' in selection.entitySelector ?
						`Cast ${selection.entitySelector.hashPrefix}`
					:
						'Cast'
				}
				startLength={56}
				endLength={24}
				format={TruncatedValueFormat.Abbr}
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if open}
			<ResourceBoundary
				resource={cast}
				placeholderText="Loading Farcaster cast (author FID + cast hash)…"
			>
				{#snippet children(cast)}
					{#if variant === 'feed' && !supportsSnapchainCast && cast.fields.username !== undefined}
						<span data-text="muted">
							@{cast.fields.username}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Immutable cast keyed by author FID and cast hash; thread, channel, and embed fields come from hub indexers.
		</p>
		<p>
			Engagement counts are off-chain snapshots—not consensus tallies or DEX quotes.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(cast)}
				{@const flatText = cast.fields.text?.replaceAll('\n', ' ') ?? ''}
				{#if (
					flatText !== ''
					&& variant === 'feed'
				)}
					<p>
						<TruncatedValue
							value={flatText}
							startLength={120}
							endLength={48}
							format={TruncatedValueFormat.Abbr}
						/>
					</p>
				{:else if flatText !== ''}
					<p>
						{cast.fields.text ?? ''}
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl>
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(cast)}
							<Timestamp
								timestamp={cast.fields.timestamp}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
				<div>
				<dt>Channel</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(cast)}
							{@const channelId = (
								cast.fields.$channel === undefined ?
									undefined
								:
									cast.fields.$channel[EntityMetaKey.Selector].id
							)}
							{@const channelPageHref = (
								channelId === undefined ?
									undefined
								:
									resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
										channelId,
									})
							)}
							{#if (
								channelPageHref !== undefined
								&& channelId !== undefined
							)}
								<a href={channelPageHref}>
									/{channelId}
								</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Parent cast</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
								{@const parentCastIdOpen = (
									cast.fields.$parentCast === undefined ?
										undefined
									:
										cast.fields.$parentCast[EntityMetaKey.Selector]
								)}
								{@const parentCastHrefOpen = (
										parentCastIdOpen === undefined || !('fid' in parentCastIdOpen) || !('hash' in parentCastIdOpen) ?
											undefined
										:
											resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid=farcasterFid]/[hash]', {
												fid: String(parentCastIdOpen.fid),
												hash: parentCastIdOpen.hash,
											})
								)}
								{#if parentCastHrefOpen !== undefined}
									<a href={parentCastHrefOpen}>View parent cast</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Parent URL</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
								{#if cast.fields.parentUrl !== undefined}
									<a href={cast.fields.parentUrl}>{cast.fields.parentUrl}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Mentions</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
								{#if (
									cast.fields.mentions !== undefined
									&& cast.fields.mentions.length
								)}
										<ul data-cast="wrap gap-2">
											{#each cast.fields.mentions as mention (String(mention))}
												<li>
													<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId=farcasterFid]', {
														userId: String(mention),
													})}>
														FID {String(mention)}
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
					<dt>Thread hash</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
								{@const threadNormOpen = (
									(() => {
										const th = (
											cast.fields.threadHash === undefined ?
												''
											:
												cast.fields.threadHash.trim()
										)
										if (th === '') {
											return undefined
										}
										const hex = (
											th.startsWith('0x') || th.startsWith('0X') ?
												th.slice(2)
											:
												th
										)
										return `0x${hex.toLowerCase()}`
									})()
								)}
								{@const warpcastThreadHrefOpen = (
									threadNormOpen !== undefined && threadNormOpen !== cast.fields.hash ?
										`https://warpcast.com/~/conversations/${threadNormOpen}`
									:
										undefined
								)}
								{#if warpcastThreadHrefOpen !== undefined}
									<a
										href={warpcastThreadHrefOpen}
										rel="noreferrer"
									>Open thread on Warpcast</a>
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
		{@const castDetailKey = stringify(selection.entitySelector)}
		<CollapsibleTabs
			id={`${castDetailKey}:carousel-cast`}
			sectionIdPrefix={castDetailKey}
			sections={collapsibleTabsSections([
					{ id: 'cast-record', label: 'Record' },
					{ id: 'cast-thread', label: 'Thread' },
					{ id: 'cast-media', label: 'Embeds' },
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
						Cast
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCastRecord()}
				<ResourceBoundary
					resource={cast}
					placeholderText="Loading Farcaster cast (author FID + cast hash)…"
				>
					{#snippet children(cast)}
						<div data-column-item="center">
							<div>
								<dt>FID</dt>
								<dd>{String(cast.fields.fid)}</dd>
							</div>

							<div>
								<dt>Hash</dt>
								<dd>
									<TruncatedValue
										value={cast.fields.hash}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionCastThread()}
				<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
							{@const authorId = (
								supportsSnapchainCast ?
									cast.fields.$author?.[EntityMetaKey.Selector]
								:
									undefined
							)}
							{@const authorUsername = supportsSnapchainCast ? undefined : cast.fields.username}
							{@const authorDisplayName = undefined}
							{@const channelId = (
								!supportsSnapchainCast || cast.fields.$channel === undefined ?
									undefined
								:
									cast.fields.$channel[EntityMetaKey.Selector].id
								)}
								{@const channelPageHref = (
									channelId === undefined ?
										undefined
									:
										resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
											channelId,
										})
								)}
								<section data-column>
									<header data-cast="wrap gap-4">
										<div data-cast="inline wrap gap-2">
											<div data-column>
												<strong>
													{authorDisplayName ?? authorUsername ?? (
														authorId === undefined ?
															`FID ${String(cast.fields.fid)}`
														:
															`FID ${String(authorId.fid)}`
													)}
												</strong>
												{#if (
													authorId !== undefined
													&& authorUsername !== undefined
													)}
														<span data-text="muted">
															<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId=farcasterFid]', {
																userId: String(authorId.fid),
															})}>
																@{authorUsername}
														</a>
													</span>
												{/if}
											</div>
										</div>
										<p data-text="muted">
											<Timestamp
												timestamp={cast.fields.timestamp}
											/>
										</p>
										{#if channelPageHref !== undefined}
											{#if channelId !== undefined}
												<p data-text="muted">
													<a href={channelPageHref}>
														/{channelId}
													</a>
												</p>
											{/if}
										{/if}
									</header>

									<p>
										{cast.fields.text ?? ''}
									</p>
								</section>
							{/snippet}
						</ResourceBoundary>
			{/snippet}

			{#snippet SectionCastMedia()}
				{#if open}
				<ResourceBoundary
					resource={cast}
					placeholderText="Loading cast mentions, channel ids & embeds…"
				>
					{#snippet children(cast)}
						<section data-column>
							<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									No mentions or embeds.
								</p>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Mentioned profiles, channels, and cast embeds appear when the provider returns them for this cast.fields.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="Mentions and embeds"
									>ⓘ</abbr>
								</Tooltip>
							</div>
						</section>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

				</CollapsibleTabs>
		{/snippet}
	</EntityView>
