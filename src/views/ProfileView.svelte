<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityFieldValues, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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
			if (bag == null) return null
			const b: Partial<EntityFieldValues<typeof schema, EntityType.FarcasterUser>> = bag
			return {
				username: typeof b.username === 'string' && b.username.length ? b.username : undefined,
				displayName: typeof b.displayName === 'string' && b.displayName.length ? b.displayName : undefined,
				avatarUrl: b.$icon?.[EntityMetaKey.Id].url,
				bio: typeof b.bio === 'string' && b.bio.length ? b.bio : undefined,
				url: typeof b.url === 'string' && b.url.length ? b.url : undefined,
				verifiedAddress: (
					typeof b.verifiedAddress === 'string' && b.verifiedAddress.length ?
						b.verifiedAddress
					:	undefined
				),
			}
		})(),
	)

	const evmHexAddress40 = (value: string): value is `0x${string}` => (
		/^0x[a-fA-F0-9]{40}$/.test(value)
	)

	const verifiedIsEvmHex = $derived(
		userField?.verifiedAddress !== undefined
		&& evmHexAddress40(userField.verifiedAddress) ?
			userField.verifiedAddress
		:
			undefined,
	)

	const displayTitle = $derived(
		userField?.displayName
		?? userField?.username
		?? String(farcasterUserId.fid),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Address from '$/views/Address.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	entityId={farcasterUserId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Icon()}
		{#if userField?.avatarUrl !== undefined}
			<IconComponent
				shape={IconShape.Circle}
				src={userField.avatarUrl}
				alt=""
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if userField?.username !== undefined && userField.username !== displayTitle}
			<span data-text="muted">
				@{userField.username}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		{#if String(farcasterUserId.fid) !== displayTitle}
			<dl>
				<div>
					<dt>FID</dt>
					<dd>{String(farcasterUserId.fid)}</dd>
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
				entityType={EntityType.FarcasterUser}
				entityId={farcasterUserId}
			>
				<QueryBoundary
					query={userQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No Farcaster profile for this id yet.
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
							{#if userField.displayName !== undefined}
								<div>
									<dt>Display name</dt>
									<dd>{userField.displayName}</dd>
								</div>
							{/if}
							{#if userField.username !== undefined}
								<div>
									<dt>Username</dt>
									<dd>{userField.username}</dd>
								</div>
							{/if}
							{#if userField.avatarUrl !== undefined}
								<div>
									<dt>Profile image</dt>
									<dd>
										<Media
											media={{ url: userField.avatarUrl }}
											alt={userField.displayName ?? userField.username ?? ''}
										/>
									</dd>
								</div>
							{/if}
							{#if userField.bio !== undefined}
								<div>
									<dt>Bio</dt>
									<dd>{userField.bio}</dd>
								</div>
							{/if}
							{#if userField.url !== undefined}
								<div>
									<dt>URL</dt>
									<dd>
										<a href={userField.url}>{userField.url}</a>
									</dd>
								</div>
							{/if}
							{#if verifiedIsEvmHex !== undefined}
								<div>
									<dt>Verified address</dt>
									<dd>
										<Address
											address={verifiedIsEvmHex}
											showAvatar={false}
										/>
									</dd>
								</div>
							{:else if userField.verifiedAddress !== undefined}
								<div>
									<dt>Verified address</dt>
									<dd>
										<TruncatedValue
											value={userField.verifiedAddress}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
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
