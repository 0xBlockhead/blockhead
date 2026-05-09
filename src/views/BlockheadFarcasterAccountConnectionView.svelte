<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityFieldValues, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'

	const evmHexAddress40 = (value: string): value is `0x${string}` => (
		/^0x[a-fA-F0-9]{40}$/.test(value)
	)


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
		?? `FID ${String(entityId.fid)}`,
	)

	const custodyIsEvmHex = $derived(
		connectionField?.custody !== undefined
		&& evmHexAddress40(connectionField.custody) ?
			connectionField.custody
		:
			undefined,
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Address from '$/views/Address.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Icon()}
		{#if connectionField?.avatarUrl !== undefined}
			<IconComponent
				shape={IconShape.Circle}
				src={connectionField.avatarUrl}
				alt=""
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if connectionField?.username !== undefined && connectionField.username !== displayTitle}
			<span data-text="muted">
				@{connectionField.username}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		<div data-column>
			{#if connectionField?.bio !== undefined}
				<p data-text="muted">
					{connectionField.bio}
				</p>
			{/if}
			{#if custodyIsEvmHex !== undefined}
				<p data-row="inline wrap gap-2">
					<span data-text="muted">Custody</span>
					<Address
						address={custodyIsEvmHex}
						showAvatar={false}
					/>
				</p>
			{:else if connectionField?.custody !== undefined}
				<p data-text="muted">
					{connectionField.custody}
				</p>
			{/if}
			<p data-text="muted">
				FID {String(entityId.fid)}
			</p>
			{#if connectionField?.signedAt !== undefined && typeof connectionField.signedAt === 'number' && Number.isFinite(connectionField.signedAt)}
				<dl>
					<div>
						<dt>Timestamp</dt>
						<dd>
							<Timestamp
								timestamp={connectionField.signedAt}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
				</dl>
			{/if}
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
				<QueryBoundary
					query={connectionQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No Farcaster connection data yet.
						</p>
					{:else if connectionField == null}
						<p data-text="muted">
							FID {String(entityId.fid)}
						</p>
					{:else}
						<section data-column>
							<h3>Connected Farcaster account</h3>
							<dl>
								<div>
									<dt>FID</dt>
									<dd>{String(entityId.fid)}</dd>
								</div>
								{#if connectionField.displayName !== undefined}
									<div>
										<dt>Name</dt>
										<dd>{connectionField.displayName}</dd>
									</div>
								{/if}
								{#if connectionField.username !== undefined}
									<div>
										<dt>Username</dt>
										<dd>@{connectionField.username}</dd>
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
										<dt>Sign-in</dt>
										<dd>{connectionField.authMethod}</dd>
									</div>
								{/if}
								{#if custodyIsEvmHex !== undefined}
									<div>
										<dt>Custody</dt>
										<dd>
											<Address
												address={custodyIsEvmHex}
												showAvatar={false}
											/>
										</dd>
									</div>
								{:else if connectionField.custody !== undefined}
									<div>
										<dt>Custody</dt>
										<dd>{connectionField.custody}</dd>
									</div>
								{/if}
								{#if connectionField.signedAt !== undefined && typeof connectionField.signedAt === 'number' && Number.isFinite(connectionField.signedAt)}
									<div>
										<dt>Signed in</dt>
										<dd>
											<Timestamp
												timestamp={connectionField.signedAt}
												format={TimestampFormat.Both}
											/>
										</dd>
									</div>
								{/if}
							</dl>
							{#if connectionField.avatarUrl !== undefined}
								<p>
									<Media
										media={{ url: connectionField.avatarUrl }}
										alt={connectionField.displayName ?? connectionField.username ?? ''}
									/>
								</p>
							{/if}
							{#if connectionField.verifications !== undefined && connectionField.verifications.length}
								<section data-stack="xs">
									<h4>Verifications</h4>
									<ul>
										{#each connectionField.verifications as v (v)}
											<li>{v}</li>
										{/each}
									</ul>
								</section>
							{/if}
						</section>
					{/if}
					{/snippet}
				</QueryBoundary>

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
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
