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
	let {
		entityId: farcasterUserId,
		href = resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
			userId: String(farcasterUserId.fid),
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterUser>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const farcasterUser = useEntity(
		EntityType.FarcasterUser,
		farcasterUserId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
			username: {},
			displayName: {},
			$icon: {},
			bio: {},
			url: {},
			primaryEvmAddress: {},
			$$verifiedAddresses: {},
		},
	)


	// Components
	import ActorView from '$/views/ActorView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	entityId={farcasterUserId}
	href={href}
	bind:open
	title="Profile"
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{farcasterUser.displayName
					?? farcasterUser.username
					?? String(farcasterUserId.fid)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{#if farcasterUser.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						shape={IconShape.Circle}
						src={farcasterUser.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(farcasterUserId.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				{#if (
					farcasterUser.username !== undefined
					&& farcasterUser.username !== (
						farcasterUser.displayName
						?? farcasterUser.username
						?? String(farcasterUserId.fid)
					)
				)}
					<span data-text="muted">
						@{farcasterUser.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if (
				farcasterUser.bio != null
				&& farcasterUser.bio !== ''
			)}
				<div>
					<dt>Bio</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								{farcasterUser.bio}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if farcasterUser.url != null}
				<div>
					<dt>URL</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								<a
									href={farcasterUser.url}
									data-text="muted"
								>{farcasterUser.url}</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Verified addresses</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterUser}
						placeholderText="Loading profile…"
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser.$$verifiedAddresses.length}
								<ul data-column="gap-2">
									{#each farcasterUser.$$verifiedAddresses as verification (String(verification[EntityMetaKey.Id].protocol) + ':' + verification[EntityMetaKey.Id].address)}
										<li>
											{#if verification[EntityMetaKey.Id].protocol === 'ethereum'}
												<ActorView
													entityId={{
														address: verification[EntityMetaKey.Id].address,
													}}
													href={resolve('/account/[address]', {
														address: verification[EntityMetaKey.Id].address,
													})}
													layout={EntityLayout.Title}
													open={false}
												/>
											{:else}
												<span data-text="mono muted">
													solana:{verification[EntityMetaKey.Id].address}
												</span>
											{/if}
										</li>
									{/each}
								</ul>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if (
				open
				&& farcasterUser.displayName != null
			)}
				<div>
					<dt>Display name</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								{farcasterUser.displayName}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& farcasterUser.username != null
			)}
				<div>
					<dt>Username</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								{farcasterUser.username}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& farcasterUser.$icon?.[EntityMetaKey.Id].url != null
			)}
				<div>
					<dt>Profile image</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading profile…"
						>
							{#snippet children(farcasterUser)}
								<Media
									media={{ url: farcasterUser.$icon[EntityMetaKey.Id].url }}
									alt={farcasterUser.displayName ?? farcasterUser.username ?? ''}
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

	{/snippet}
</EntityView>
