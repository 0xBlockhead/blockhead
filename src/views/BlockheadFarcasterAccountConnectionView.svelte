<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'


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
			| 'Icon'
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const connection = useEntity(
		EntityType.BlockheadFarcasterAccountConnection,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.BlockheadFarcasterAccountConnection]?.map((r) => r.source)
				?? [
					Source.Neynar_Rest,
				]
			),
			displayName: {},
			username: {},
			$icon: {},
			bio: {},
			custody: {},
			signedAt: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading connection…"
		>
			{#snippet children(c)}
				{@const headline = (
					c.displayName
					?? c.username
					?? `FID ${String(entityId.fid)}`
				)}
				{headline}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			FID {String(entityId.fid)}
		</span>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={connection}
			placeholderText="Loading icon…"
		>
			{#snippet children(c)}
				{#if c.$icon}
					{#if c.$icon[EntityMetaKey.Id].url}
						<IconComponent
							shape={IconShape.Circle}
							src={c.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
					{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={connection}
			placeholderText=""
		>
			{#snippet children(c)}
				{@const headline = (
					c.displayName
					?? c.username
					?? `FID ${String(entityId.fid)}`
				)}
				{#if c.username !== undefined && c.username !== headline}
					<span data-text="muted">
						@{c.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column>
			<ResourceBoundary
				resource={connection}
				placeholderText="Loading profile…"
			>
				{#snippet Pending()}{/snippet}
				{#snippet children(c)}
					<dl data-column-item="center">
						<div>
							<dt>FID</dt>
							<dd data-text="mono">
								{@render Id()}
							</dd>
						</div>
						{#if c.bio != null}
							{#if c.bio !== ''}
								<div>
									<dt>Bio</dt>
									<dd>{c.bio}</dd>
								</div>
							{/if}
						{/if}
						{#if c.bio == null}
							<div>
								<dt>Bio</dt>
								<dd data-text="muted">No profile bio is set.</dd>
							</div>
						{/if}
						{#if c.bio !== null}
							{#if c.bio === ''}
								<div>
									<dt>Bio</dt>
									<dd data-text="muted">No profile bio is set.</dd>
								</div>
							{/if}
						{/if}
						{#if open}
							{#if c.custody}
								<div>
									<dt>Custody</dt>
									<dd>
										<TruncatedValue
											value={c.custody}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}
						{/if}
						{#if open}
							{#if c.signedAt !== undefined}
								<div>
									<dt>Signed in</dt>
									<dd>
										<Timestamp
											timestamp={c.signedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadFarcasterAccountConnection}
				{entityId}
			>
				{#snippet children()}
					<FarcasterCastsView
						entityFieldReference={{
							entityType: EntityType.FarcasterFeed,
							entityId: {
								variant: 'byUser',
								fid: entityId.fid,
							},
							fieldName: '$$entries',
						}}
						id="casts"
						title="Feed"
						href={resolve(`/farcaster/feed/user/${String(entityId.fid)}`)}
					/>
				{/snippet}
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
