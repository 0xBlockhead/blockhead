<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { resolve } from '$app/paths'
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
			| 'SummaryIcon'
			| 'SummaryHeadingAfter'
			| 'SummaryContent'
		>
	> = $props()


	const evmHexAddress40 = (value: string): value is `0x${string}` => (
		/^0x[a-fA-F0-9]{40}$/.test(value)
	)

	const farcasterUserIdKey = $derived(
		stringify(entityId),
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
		?? `FID ${String(entityId.fid)}`,
	)

	const verifiedIsEvmHex = $derived(
		userField?.verifiedAddress != null
		&& evmHexAddress40(userField.verifiedAddress) ?
			userField.verifiedAddress
		:
			undefined,
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Address from '$/views/Address.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	{entityId}
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
		<div data-stack="tight">
			{#if userField?.bio != null}
				<p data-text="muted">
					{userField.bio}
				</p>
			{/if}
			{#if userField?.url != null}
				<p>
					<a
						href={userField.url}
						data-text="muted"
					>{userField.url}</a>
				</p>
			{/if}
			{#if verifiedIsEvmHex != null}
				<p data-row="inline wrap gap-2">
					<span data-text="muted">Verified</span>
					<Address
						address={verifiedIsEvmHex}
						showAvatar={false}
					/>
				</p>
			{:else if userField?.verifiedAddress != null}
				<p data-text="muted">
					{userField.verifiedAddress}
				</p>
			{/if}
			<p data-text="muted">
				FID {String(entityId.fid)}
			</p>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.FarcasterUser}
			{entityId}
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
						<p data-text="muted">
							FID {String(entityId.fid)}
						</p>
					{:else}
						<section data-stack="tight">
							<h3>Farcaster profile</h3>
							<dl>
								<div>
									<dt>FID</dt>
									<dd>{String(entityId.fid)}</dd>
								</div>
								{#if userField.displayName != null}
									<div>
										<dt>Name</dt>
										<dd>{userField.displayName}</dd>
									</div>
								{/if}
								{#if userField.username != null}
									<div>
										<dt>Username</dt>
										<dd>
											@{userField.username}
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
										<dt>Link</dt>
										<dd>
											<a href={userField.url}>{userField.url}</a>
										</dd>
									</div>
								{/if}
								{#if verifiedIsEvmHex != null}
									<div>
										<dt>Verified address</dt>
										<dd>
											<Address
												address={verifiedIsEvmHex}
												showAvatar={false}
											/>
										</dd>
									</div>
								{:else if userField.verifiedAddress != null}
									<div>
										<dt>Verified address</dt>
										<dd>{userField.verifiedAddress}</dd>
									</div>
								{/if}
							</dl>
							{#if userField.pfpUrl != null}
								<p>
									<Icon
										src={userField.pfpUrl}
										alt=""
										size="6rem"
									/>
								</p>
							{/if}
						</section>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<FarcasterCastsView
			href={resolve('/farcaster/feed')}
			id={`${farcasterUserIdKey}:casts`}
			open={false}
			parentEntityType={EntityType.FarcasterUser}
			parentEntityId={entityId}
			title="Casts"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
