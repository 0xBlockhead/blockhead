<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityFieldValues, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const connectionIdKey = $derived(
		stringify(entityId),
	)

	const connectionQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					row: entityCollectionByEntityType[EntityType.BlockheadFarcasterAccountConnection],
				})
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						connectionIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => connectionIdKey],
	)

	const connectionRow = $derived(
		connectionQuery.data?.[0]?.row,
	)

	const connectionField = $derived(
		(() => {
			const bag = connectionRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const f: Partial<EntityFieldValues<typeof schema, EntityType.BlockheadFarcasterAccountConnection>> = bag
			return {
				username: typeof f.username === 'string' && f.username.length ? f.username : undefined,
				displayName: typeof f.displayName === 'string' && f.displayName.length ? f.displayName : undefined,
				avatarUrl: f.$icon?.[EntityMetaKey.Id].url,
				bio: typeof f.bio === 'string' && f.bio.length ? f.bio : undefined,
				custody: typeof f.custody === 'string' && f.custody.length ? f.custody : undefined,
				authMethod: f.authMethod,
				verifications: Array.isArray(f.verifications) ?
					f.verifications.filter((value): value is string => typeof value === 'string' && value.length > 0)
				:	undefined,
				signedAt: typeof f.signedAt === 'number' ? f.signedAt : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		connectionField?.displayName
		?? connectionField?.username
		?? String(entityId.fid),
	)

	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Media from '$/components/Media.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet HeadingAfter()}
		{#if connectionField?.username !== undefined && connectionField.username !== displayTitle}
			<span data-text="muted">
				@{connectionField.username}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		{#if String(entityId.fid) !== displayTitle}
			<dl>
				<div>
					<dt>FID</dt>
					<dd>{String(entityId.fid)}</dd>
				</div>
			</dl>
		{/if}
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
				<QueryBoundary
					query={connectionQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No Farcaster connection data yet.
						</p>
					{:else if connectionField == null}
						<dl>
							<div>
								<dt>FID</dt>
								<dd>{String(entityId.fid)}</dd>
							</div>
						</dl>
					{:else}
						<dl>
							<div>
								<dt>FID</dt>
								<dd>{String(entityId.fid)}</dd>
							</div>
							{#if connectionField.displayName !== undefined}
								<div>
									<dt>Display name</dt>
									<dd>{connectionField.displayName}</dd>
								</div>
							{/if}
							{#if connectionField.username !== undefined}
								<div>
									<dt>Username</dt>
									<dd>{connectionField.username}</dd>
								</div>
							{/if}
							{#if connectionField.avatarUrl !== undefined}
								<div>
									<dt>Profile image</dt>
									<dd data-column>
										<Media
											media={{ url: connectionField.avatarUrl }}
											alt={connectionField.displayName ?? connectionField.username ?? ''}
										/>
										<a href={connectionField.avatarUrl}>{connectionField.avatarUrl}</a>
									</dd>
								</div>
							{/if}
							{#if connectionField.bio !== undefined}
								<div>
									<dt>Bio</dt>
									<dd>{connectionField.bio}</dd>
								</div>
							{/if}
							{#if connectionField.authMethod !== undefined}
								<div>
									<dt>Auth method</dt>
									<dd>{connectionField.authMethod}</dd>
								</div>
							{/if}
							{#if connectionField.custody !== undefined}
								<div>
									<dt>Custody</dt>
									<dd>{connectionField.custody}</dd>
								</div>
							{/if}
							{#if connectionField.verifications !== undefined && connectionField.verifications.length}
								<div>
									<dt>Verifications</dt>
									<dd>{connectionField.verifications.join(', ')}</dd>
								</div>
							{/if}
							{#if connectionField.signedAt !== undefined}
								<div>
									<dt>Signed at</dt>
									<dd>{new Date(connectionField.signedAt).toISOString()}</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>

