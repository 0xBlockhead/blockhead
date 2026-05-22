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
		children: _children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
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
	summaryUsesHeading={true}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				{#if connection.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						shape={IconShape.Circle}
						src={connection.$icon[EntityMetaKey.Id].url}
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
			{#snippet children(connection)}
				{connection.displayName ?? connection.username ?? String(entityId.fid)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				{#if (
					connection.username !== undefined
					&& connection.username !== (
						connection.displayName ?? connection.username ?? String(entityId.fid)
					)
				)}
					<span data-text="muted">
						@{connection.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<span>
			FID {String(entityId.fid)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading Farcaster account connection (FID)…"
		>
			{#snippet children(connection)}
				<dl data-column-item="center">
					{#if open}
						{#if connection.username}
							<div>
								<dt>fname</dt>
								<dd>@{connection.username}</dd>
							</div>
						{/if}
					{/if}

					{#if connection.bio}
						<div>
							<dt>Bio</dt>
							<dd>{connection.bio}</dd>
						</div>
					{/if}

					{#if open}
						{#if connection.authMethod}
							<div>
								<dt>Auth routing</dt>
								<dd>{connection.authMethod}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if connection.custody}
							<div>
								<dt>Farcaster custody address</dt>
								<dd>{connection.custody}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if connection.verifications}
							{#if connection.verifications.length}
								<div>
									<dt>Verified signer addresses</dt>
									<dd>{connection.verifications.join(', ')}</dd>
								</div>
							{/if}
						{/if}
					{/if}

					{#if open}
						{#if connection.signedAt !== undefined}
							<div>
								<dt>Signed at</dt>
								<dd>{new Date(connection.signedAt).toISOString()}</dd>
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

		{#if _children}
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

					{#snippet Markers(_context)}
						<a
							data-scroll-marker-label="Route"
							href={`#farcaster-account:${String(entityId.fid)}:page-content`}
						>Route</a>
					{/snippet}

					{#snippet body(_ctx)}
						<section id={`farcaster-account:${String(entityId.fid)}:page-content`}>
							{@render _children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>
