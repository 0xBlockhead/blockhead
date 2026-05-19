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


	// Props
	let {
		children,
		entityId: farcasterUserId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterUser>
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
			| 'HeadingAfter'
			| 'Content'
			| 'Heading'
		>
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
			verifiedAddress: {},
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
	{href}
	bind:open
	title="Profile"
	{...entityViewRest}
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

	{#snippet Id()}
		<span data-text="font-monospace">
			FID {String(farcasterUserId.fid)}
		</span>
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
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(farcasterUser)}
				<div data-column>
					<dl data-column-item="center">
						{#if farcasterUser.bio != null}
							{#if farcasterUser.bio !== ''}
								<div>
									<dt>Bio</dt>
									<dd>{farcasterUser.bio}</dd>
								</div>
							{/if}
						{/if}

						{#if farcasterUser.url != null}
							<div>
								<dt>URL</dt>
								<dd>
									<a
										href={farcasterUser.url}
										data-text="muted"
									>{farcasterUser.url}</a>
								</dd>
							</div>
						{/if}

						{#if farcasterUser.verifiedAddress !== undefined}
							<div>
								<dt>Verified address</dt>
								<dd>
									<ActorView
										entityId={{
											address: farcasterUser.verifiedAddress,
										}}
										href={resolve('/~/(accounts)/accounts/account/[accountId]', {
											accountId: farcasterUser.verifiedAddress,
										})}
										layout={EntityLayout.Id}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open}
							{#if farcasterUser.displayName != null}
								<div>
									<dt>Display name</dt>
									<dd>{farcasterUser.displayName}</dd>
								</div>
							{/if}
						{/if}

						{#if open}
							{#if farcasterUser.username != null}
								<div>
									<dt>Username</dt>
									<dd>{farcasterUser.username}</dd>
								</div>
							{/if}
						{/if}

						{#if open}
							{#if farcasterUser.$icon}
								{#if farcasterUser.$icon[EntityMetaKey.Id].url != null}
									<div>
										<dt>Profile image</dt>
										<dd>
											<Media
												media={{ url: farcasterUser.$icon[EntityMetaKey.Id].url }}
												alt={farcasterUser.displayName ?? farcasterUser.username ?? ''}
											/>
										</dd>
									</div>
								{/if}
							{/if}
						{/if}
					</dl>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.FarcasterUser}
				entityId={farcasterUserId}
			/>
		{/if}
	{/snippet}
</EntityView>
