<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


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
			| 'SummaryIcon'
			| 'SummaryHeadingAfter'
			| 'SummaryContent'
		>
	> = $props()


	const farcasterUserIdKey = $derived(
		stringify(farcasterUserId),
	)

	const userQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.FarcasterUser] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						farcasterUserIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => farcasterUserIdKey],
	)

	const farcasterUserRow = $derived(
		userQuery.data?.[0]?.row,
	)

	const userField = $derived(
		(() => {
			const bag = farcasterUserRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const pick = (key: string) => {
				const x = Reflect.get(b, key)
				return typeof x === 'string' && x.length ? x : undefined
			}
			return {
				username: pick('username'),
				displayName: pick('displayName'),
				pfpUrl: pick('pfpUrl'),
				bio: pick('bio'),
				url: pick('url'),
				verifiedAddress: pick('verifiedAddress'),
			}
		})(),
	)

	const displayTitle = $derived(
		userField?.displayName
		?? userField?.username
		?? String(farcasterUserId.fid),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	entityId={farcasterUserId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryIcon()}
		{#if userField?.pfpUrl != null}
			<Icon
				shape={IconShape.Circle}
				src={userField.pfpUrl}
				alt=""
			/>
		{/if}
	{/snippet}

	{#snippet SummaryHeadingAfter()}
		{#if userField?.username != null && userField.username !== displayTitle}
			<span data-text="muted">
				@{userField.username}
			</span>
		{/if}
	{/snippet}

	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>FID</dt>
				<dd>{String(farcasterUserId.fid)}</dd>
			</div>
		</dl>
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
			>
				<QueryBoundary
					query={userQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No Farcaster user row in collections yet (no resolver for this FID).
						</p>
					{:else if userField == null}
						<dl>
							<div>
								<dt>FID</dt>
								<dd>{String(farcasterUserId.fid)}</dd>
							</div>
						</dl>
					{:else}
						<dl>
							<div>
								<dt>FID</dt>
								<dd>{String(farcasterUserId.fid)}</dd>
							</div>
							{#if userField.displayName != null}
								<div>
									<dt>Display name</dt>
									<dd>{userField.displayName}</dd>
								</div>
							{/if}
							{#if userField.username != null}
								<div>
									<dt>Username</dt>
									<dd>{userField.username}</dd>
								</div>
							{/if}
							{#if userField.pfpUrl != null}
								<div>
									<dt>Profile image</dt>
									<dd>
										<Icon
											src={userField.pfpUrl}
											alt=""
											size="6rem"
										/>
									</dd>
								</div>
							{/if}
							{#if userField.bio != null}
								<div>
									<dt>Bio</dt>
									<dd>{userField.bio}</dd>
								</div>
							{/if}
							{#if userField.url != null}
								<div>
									<dt>URL</dt>
									<dd>
										<a href={userField.url}>{userField.url}</a>
									</dd>
								</div>
							{/if}
							{#if userField.verifiedAddress != null}
								<div>
									<dt>Verified address</dt>
									<dd>{userField.verifiedAddress}</dd>
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
