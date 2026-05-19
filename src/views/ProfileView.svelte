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
			{#snippet children(p)}
				{p.displayName
					?? p.username
					?? String(farcasterUserId.fid)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(p)}
				{#if p.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						shape={IconShape.Circle}
						src={p.$icon[EntityMetaKey.Id].url}
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
			{#snippet children(p)}
				{#if (
					p.username !== undefined
					&& p.username !== (
						p.displayName
						?? p.username
						?? String(farcasterUserId.fid)
					)
				)}
					<span data-text="muted">
						@{p.username}
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
			{#snippet children(p)}
				<div data-column>
					<dl data-column-item="center">
						<div>
							<dt>FID</dt>
							<dd data-text="mono">
								{@render Id()}
							</dd>
						</div>
						{#if p.bio != null}
							{#if p.bio !== ''}
								<div>
									<dt>Bio</dt>
									<dd>{p.bio}</dd>
								</div>
							{/if}
						{/if}

						{#if p.url != null}
							<div>
								<dt>URL</dt>
								<dd>
									<a
										href={p.url}
										data-text="muted"
									>{p.url}</a>
								</dd>
							</div>
						{/if}

						{#if p.verifiedAddress !== undefined}
							<div>
								<dt>Verified address</dt>
								<dd>
									<ActorView
										entityId={{
											address: p.verifiedAddress,
										}}
										href={resolve('/~/(accounts)/accounts/account/[accountId]', {
											accountId: p.verifiedAddress,
										})}
										layout={EntityLayout.Id}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open}
							{#if p.displayName != null}
								<div>
									<dt>Display name</dt>
									<dd>{p.displayName}</dd>
								</div>
							{/if}
						{/if}

						{#if open}
							{#if p.username != null}
								<div>
									<dt>Username</dt>
									<dd>{p.username}</dd>
								</div>
							{/if}
						{/if}

						{#if open}
							{#if p.$icon}
								{#if p.$icon[EntityMetaKey.Id].url != null}
									<div>
										<dt>Profile image</dt>
										<dd>
											<Media
												media={{ url: p.$icon[EntityMetaKey.Id].url }}
												alt={p.displayName ?? p.username ?? ''}
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
