<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


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
			entityId: EntityId<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
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
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const connection = useEntity(
		EntityType.BlockheadFarcasterAccountConnection,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
			username: {},
			displayName: {},
			$icon: {},
			bio: {},
			...(open ?
				{
					verifications: {},
					custody: {},
					authMethod: {},
					signedAt: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(account)}
				{#if account.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						shape={IconShape.Circle}
						src={account.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(account)}
				{account.displayName ?? account.username ?? String(entityId.fid)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(account)}
				{#if (
					account.username !== undefined
					&& account.username !== (
						account.displayName ?? account.username ?? String(entityId.fid)
					)
				)}
					<span data-text="muted">
						@{account.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			FID {String(entityId.fid)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(account)}
				<dl data-column-item="center">
					<div>
						<dt>FID</dt>
						<dd data-text="mono">
							{@render Id()}
						</dd>
					</div>
					{#if open}
						{#if account.username}
							<div>
								<dt>fname</dt>
								<dd>@{account.username}</dd>
							</div>
						{/if}
					{/if}

					{#if account.bio}
						<div>
							<dt>Bio</dt>
							<dd>{account.bio}</dd>
						</div>
					{/if}

					{#if open}
						{#if account.authMethod}
							<div>
								<dt>Auth routing</dt>
								<dd>{account.authMethod}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if account.custody}
							<div>
								<dt>Farcaster custody address</dt>
								<dd>{account.custody}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if account.verifications}
							{#if account.verifications.length}
								<div>
									<dt>Verified signer addresses</dt>
									<dd>{account.verifications.join(', ')}</dd>
								</div>
							{/if}
						{/if}
					{/if}

					{#if open}
						{#if account.signedAt !== undefined}
							<div>
								<dt>Signed at</dt>
								<dd>{new Date(account.signedAt).toISOString()}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.BlockheadFarcasterAccountConnection}
			{entityId}
		/>

		{#if children}
			<div
				class="entity-view-detail-carousels"
				data-column="gap-3"
			>
				<CollapsibleTabs
					id={`farcaster-account:${String(entityId.fid)}:carousel-more`}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<Heading>Page</Heading>
						</header>
					{/snippet}

					{#snippet Markers()}
						<a
							data-scroll-marker-label="Route"
							href={`#farcaster-account:${String(entityId.fid)}:page-content`}
						>Route</a>
					{/snippet}

					{#snippet children(_ctx)}
						<section id={`farcaster-account:${String(entityId.fid)}:page-content`}>
							{@render children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>
