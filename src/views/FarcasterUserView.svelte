<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import { mergeEntityCollectionRowFields } from '$/collections/mergeEntityCollectionRowFields.ts'


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


	const evmHexAddress40 = (value: string): value is `0x${string}` => (
		/^0x[a-fA-F0-9]{40}$/.test(value)
	)

	const farcasterUserIdKey = $derived(
		stringify(entityId),
	)

	const farcasterUserMergeSourceOrder = [
		Source.Neynar_Rest,
		Source.Snapchain_Rest,
		Source.Farcaster_Rest,
	] as const

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

	const userFields = $derived(
		mergeEntityCollectionRowFields(
			EntityType.FarcasterUser,
			userQuery.data,
			farcasterUserMergeSourceOrder,
		),
	)

	const displayTitle = $derived(
		userFields.displayName
		?? userFields.username
		?? `FID ${String(entityId.fid)}`,
	)

	const verifiedIsEvmHex = $derived(
		userFields.verifiedAddress !== undefined
		&& evmHexAddress40(userFields.verifiedAddress) ?
			userFields.verifiedAddress
		:
			undefined,
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Address from '$/views/Address.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Icon()}
		{#if userFields.pfpUrl !== undefined}
			<Icon
				shape={IconShape.Circle}
				src={userFields.pfpUrl}
				alt=""
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if userFields.username !== undefined && userFields.username !== displayTitle}
			<span data-text="muted">
				@{userFields.username}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		<div data-column>
			{#if userFields.bio !== undefined}
				<p data-text="muted">
					{userFields.bio}
				</p>
			{/if}
			{#if userFields.url !== undefined}
				<p>
					<a
						href={userFields.url}
						data-text="muted"
					>{userFields.url}</a>
				</p>
			{/if}
			{#if verifiedIsEvmHex !== undefined}
				<p data-row="inline wrap gap-2">
					<span data-text="muted">Verified</span>
					<Address
						address={verifiedIsEvmHex}
						showAvatar={false}
					/>
				</p>
			{:else if userFields.verifiedAddress !== undefined}
				<p data-text="muted">
					<TruncatedValue
						value={userFields.verifiedAddress}
						format={TruncatedValueFormat.Visual}
					/>
				</p>
			{/if}
			{#if displayTitle !== `FID ${String(entityId.fid)}`}
				<p data-text="muted">
					FID {String(entityId.fid)}
				</p>
			{/if}
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

				{#snippet children(farcasterUserResultRows)}
					{#if farcasterUserResultRows == null || farcasterUserResultRows.length === 0}
						<p data-text="muted">
							No Farcaster profile for this id yet.
						</p>
					{:else}
						<section data-column>
							<h3>Farcaster profile</h3>
							<dl>
								<div>
									<dt>FID</dt>
									<dd>{String(entityId.fid)}</dd>
								</div>
								{#if userFields.displayName !== undefined}
									<div>
										<dt>Name</dt>
										<dd>{userFields.displayName}</dd>
									</div>
								{/if}
								{#if userFields.username !== undefined}
									<div>
										<dt>Username</dt>
										<dd>
											@{userFields.username}
										</dd>
									</div>
								{/if}
								{#if userFields.bio !== undefined}
									<div>
										<dt>Bio</dt>
										<dd>{userFields.bio}</dd>
									</div>
								{/if}
								{#if userFields.url !== undefined}
									<div>
										<dt>Link</dt>
										<dd>
											<a href={userFields.url}>{userFields.url}</a>
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
								{:else if userFields.verifiedAddress !== undefined}
									<div>
										<dt>Verified address</dt>
										<dd>
											<TruncatedValue
												value={userFields.verifiedAddress}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}
							</dl>
							{#if userFields.pfpUrl !== undefined}
								<p>
									<Media
										media={{ url: userFields.pfpUrl }}
										alt={userFields.displayName ?? userFields.username ?? ''}
									/>
								</p>
							{/if}
						</section>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
