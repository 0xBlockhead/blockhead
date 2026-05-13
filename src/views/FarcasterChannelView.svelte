<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterChannel>
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
		>
	> = $props()


	const channel = useEntity(
		EntityType.FarcasterChannel,
		entityId,
		{
			$: [
				Source.Farcaster_Rest,
			],
			name: {},
			url: {},
			description: {},
			$icon: {},
			$headerImage: {},
			createdAt: {},
			followerCount: {},
			memberCount: {},
			pinnedCastHash: {},
			publicCasting: {},
			externalLinkTitle: {},
			externalLinkUrl: {},
			followedAt: {},
			$lead: {},
			$moderator: {},
			$$moderators: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.FarcasterChannel}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary resource={channel}>
			{#snippet children(_channel)}
				<HeadingComponent>
					<a {href}>
						{_channel.name ?? entityId.id}
					</a>
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={channel}>
			{#snippet children(_channel)}
				<div data-column>
					<dl>
						{#if _channel.followerCount !== undefined}
							<div>
								<dt>Followers</dt>
								<dd>{String(_channel.followerCount)}</dd>
							</div>
						{/if}
						{#if _channel.memberCount !== undefined}
							<div>
								<dt>Members</dt>
								<dd>{String(_channel.memberCount)}</dd>
							</div>
						{/if}
						{#if _channel.publicCasting !== undefined}
							<div>
								<dt>Public casting</dt>
								<dd>{_channel.publicCasting ? 'Yes' : 'No'}</dd>
							</div>
						{/if}
						{#if open}
							{#if _channel.name !== undefined}
								<div>
									<dt>Name</dt>
									<dd>{_channel.name}</dd>
								</div>
							{/if}
							<div>
								<dt>Channel id</dt>
								<dd>{entityId.id}</dd>
							</div>
							{#if _channel.url !== undefined}
								<div>
									<dt>URL</dt>
									<dd>
										<a href={_channel.url}>{_channel.url}</a>
									</dd>
								</div>
							{/if}
							{#if _channel.description !== undefined}
								<div>
									<dt>Description</dt>
									<dd>{_channel.description}</dd>
								</div>
							{/if}
							{#if _channel.$icon !== undefined}
								{#if _channel.$icon[EntityMetaKey.Id].url !== undefined}
									<div>
										<dt>Logo</dt>
										<dd data-column>
											<Media
												media={{ url: _channel.$icon[EntityMetaKey.Id].url }}
												alt=""
											/>
											<a href={_channel.$icon[EntityMetaKey.Id].url}>{_channel.$icon[EntityMetaKey.Id].url}</a>
										</dd>
									</div>
								{/if}
							{/if}
							{#if _channel.$lead !== undefined}
								{#if _channel.$lead[EntityMetaKey.Id].fid !== undefined}
									<div>
										<dt>Lead</dt>
										<dd>
											<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
												userId: String(_channel.$lead[EntityMetaKey.Id].fid),
											})}>
												FID {String(_channel.$lead[EntityMetaKey.Id].fid)}
											</a>
										</dd>
									</div>
								{/if}
							{/if}
							{#if _channel.$moderator !== undefined}
								{#if _channel.$moderator[EntityMetaKey.Id].fid !== undefined}
									<div>
										<dt>Moderator</dt>
										<dd>
											<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
												userId: String(_channel.$moderator[EntityMetaKey.Id].fid),
											})}>
												FID {String(_channel.$moderator[EntityMetaKey.Id].fid)}
											</a>
										</dd>
									</div>
								{/if}
							{/if}
							{#if _channel.$$moderators.length}
								<div>
									<dt>Moderators</dt>
									<dd>
										<ul>
											{#each _channel.$$moderators as mod (String(mod[EntityMetaKey.Id].fid))}
												<li>
													<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
														userId: String(mod[EntityMetaKey.Id].fid),
													})}>
														FID {String(mod[EntityMetaKey.Id].fid)}
													</a>
												</li>
											{/each}
										</ul>
									</dd>
								</div>
							{/if}
							{#if _channel.createdAt !== undefined}
								<div>
									<dt>Created</dt>
									<dd>
										<Timestamp
											timestamp={_channel.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
							{#if _channel.pinnedCastHash !== undefined}
								<div>
									<dt>Pinned cast</dt>
									<dd>
										<span data-text="font-monospace">
											<TruncatedValue
												value={_channel.pinnedCastHash}
												startLength={10}
												endLength={8}
												format={TruncatedValueFormat.Visual}
											/>
										</span>
									</dd>
								</div>
							{/if}
							{#if _channel.externalLinkUrl !== undefined}
								<div>
									<dt>External link</dt>
									<dd>
										<a href={_channel.externalLinkUrl}>
											{_channel.externalLinkTitle ?? _channel.externalLinkUrl}
										</a>
									</dd>
								</div>
							{/if}
							{#if _channel.followedAt !== undefined}
								<div>
									<dt>Followed at</dt>
									<dd>
										<Timestamp
											timestamp={_channel.followedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					</dl>
					{#if _channel.description !== undefined}
						{#if !open}
							<p data-text="muted">
								{_channel.description}
							</p>
						{/if}
					{/if}
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.FarcasterChannel}
			{entityId}
		/>
		<ResourceBoundary resource={channel}>
			{#snippet children(_channel)}
				<section data-column>
					<h3>Channel</h3>
					{#if _channel.$headerImage !== undefined}
						{#if _channel.$headerImage[EntityMetaKey.Id].url !== undefined}
							<p>
								<Media
									media={{ url: _channel.$headerImage[EntityMetaKey.Id].url }}
									fit="cover"
								/>
							</p>
						{/if}
					{/if}
				</section>
			{/snippet}
		</ResourceBoundary>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
