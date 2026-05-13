<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


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
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const farcasterUser = useEntity(
		EntityType.FarcasterUser,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			],
			displayName: {},
			username: {},
			bio: {},
			url: {},
			verifiedAddress: {},
			$icon: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActorView from '$/views/ActorView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(u)}
				<HeadingComponent>
					{u.displayName
						?? u.username
						?? `FID ${String(entityId.fid)}`}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(u)}
				{#if u.$icon}
					{#if u.$icon[EntityMetaKey.Id].url}
						<IconComponent
							shape={IconShape.Circle}
							src={u.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
					{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading profile…"
		>
			{#snippet children(u)}
				{#if (
					u.username !== undefined
					&& u.username !== (
						u.displayName
						?? u.username
						?? `FID ${String(entityId.fid)}`
					)
				)}
					<span data-text="muted">
						@{u.username}
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
			{#snippet children(u)}
				<div data-column>
					{#if u.bio}
						<p data-text="muted">
							{u.bio}
						</p>
					{/if}
					{#if u.url}
						<p>
							<a
								href={u.url}
								data-text="muted"
							>{u.url}</a>
						</p>
					{/if}
					{#if u.verifiedAddress !== undefined}
						<p data-row="inline wrap gap-2">
							<span data-text="muted">Verified</span>
							<ActorView
								entityId={{
									address: u.verifiedAddress,
								}}
								href={resolve('/~/(accounts)/accounts/account/[accountId]', {
									accountId: u.verifiedAddress,
								})}
								layout={EntityLayout.Id}
								open={false}
								showTypeAnnotation={false}
							/>
						</p>
					{/if}
					{#if (
						(
							u.displayName
							?? u.username
							?? `FID ${String(entityId.fid)}`
						)
						!== `FID ${String(entityId.fid)}`
					)}
						<p data-text="muted">
							{`FID ${String(entityId.fid)}`}
						</p>
					{/if}
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.FarcasterUser}
			{entityId}
		>
			<ResourceBoundary
				resource={farcasterUser}
				placeholderText="Loading profile…"
			>
				{#snippet children(u)}
					<section data-column>
						<h3>Farcaster profile</h3>
						<dl>
							<div>
								<dt>FID</dt>
								<dd>{String(entityId.fid)}</dd>
							</div>
							{#if u.displayName}
								<div>
									<dt>Name</dt>
									<dd>{u.displayName}</dd>
								</div>
							{/if}
							{#if u.username}
								<div>
									<dt>Username</dt>
									<dd>
										@{u.username}
									</dd>
								</div>
							{/if}
							{#if u.bio}
								<div>
									<dt>Bio</dt>
									<dd>{u.bio}</dd>
								</div>
							{/if}
							{#if u.url}
								<div>
									<dt>Link</dt>
									<dd>
										<a href={u.url}>{u.url}</a>
									</dd>
								</div>
							{/if}
							{#if u.verifiedAddress !== undefined}
								<div>
									<dt>Verified address</dt>
									<dd>
										<ActorView
											entityId={{
												address: u.verifiedAddress,
											}}
											href={resolve('/~/(accounts)/accounts/account/[accountId]', {
												accountId: u.verifiedAddress,
											})}
											layout={EntityLayout.Id}
											open={false}
											showTypeAnnotation={false}
										/>
									</dd>
								</div>
							{/if}
						</dl>
						{#if u.$icon}
							{#if u.$icon[EntityMetaKey.Id].url}
								<p>
									<Media
										media={{ url: u.$icon[EntityMetaKey.Id].url }}
										alt={(u.displayName ?? u.username) ?? ''}
									/>
								</p>
							{/if}
						{/if}
					</section>
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
