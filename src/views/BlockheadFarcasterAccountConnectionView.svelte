<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { resolve } from '$app/paths'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'

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
			| 'Summary'
			| 'SummaryIcon'
			| 'SummaryHeadingAfter'
			| 'SummaryContent'
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
			if (bag == null || typeof bag !== 'object') return null
			const verifications = Reflect.get(bag, 'verifications')
			const signedAt = Reflect.get(bag, 'signedAt')
			const pick = (key: string) => {
				const x = Reflect.get(bag, key)
				return typeof x === 'string' && x.length ? x : undefined
			}
			return {
				username: pick('username'),
				displayName: pick('displayName'),
				pfpUrl: pick('pfpUrl'),
				bio: pick('bio'),
				custody: pick('custody'),
				authMethod: pick('authMethod'),
				verifications: Array.isArray(verifications) ?
					verifications.filter((value): value is string => typeof value === 'string' && value.length > 0)
				:	undefined,
				signedAt: typeof signedAt === 'number' ? signedAt : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		connectionField?.displayName
		?? connectionField?.username
		?? `FID ${String(entityId.fid)}`,
	)

	const custodyIsEvmHex = $derived(
		connectionField?.custody != null
		&& evmHexAddress40(connectionField.custody) ?
			connectionField.custody
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
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryIcon()}
		{#if connectionField?.pfpUrl != null}
			<Icon
				shape={IconShape.Circle}
				src={connectionField.pfpUrl}
				alt=""
			/>
		{/if}
	{/snippet}

	{#snippet SummaryHeadingAfter()}
		{#if connectionField?.username != null && connectionField.username !== displayTitle}
			<span data-text="muted">
				@{connectionField.username}
			</span>
		{/if}
	{/snippet}

	{#snippet SummaryContent()}
		<div data-stack="tight">
			{#if connectionField?.bio != null}
				<p data-text="muted">
					{connectionField.bio}
				</p>
			{/if}
			{#if custodyIsEvmHex != null}
				<p data-row="inline wrap gap-2">
					<span data-text="muted">Custody</span>
					<Address
						address={custodyIsEvmHex}
						showAvatar={false}
					/>
				</p>
			{:else if connectionField?.custody != null}
				<p data-text="muted">
					{connectionField.custody}
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
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No Farcaster connection row in collections yet.
						</p>
					{:else if connectionField == null}
						<p data-text="muted">
							FID {String(entityId.fid)}
						</p>
					{:else}
						<section data-stack="tight">
							<h3>Connected Farcaster account</h3>
							<dl>
								<div>
									<dt>FID</dt>
									<dd>{String(entityId.fid)}</dd>
								</div>
								{#if connectionField.displayName != null}
									<div>
										<dt>Name</dt>
										<dd>{connectionField.displayName}</dd>
									</div>
								{/if}
								{#if connectionField.username != null}
									<div>
										<dt>Username</dt>
										<dd>@{connectionField.username}</dd>
									</div>
								{/if}
								{#if connectionField.bio != null}
									<div>
										<dt>Bio</dt>
										<dd>{connectionField.bio}</dd>
									</div>
								{/if}
								{#if connectionField.authMethod != null}
									<div>
										<dt>Sign-in</dt>
										<dd>{connectionField.authMethod}</dd>
									</div>
								{/if}
								{#if custodyIsEvmHex != null}
									<div>
										<dt>Custody</dt>
										<dd>
											<Address
												address={custodyIsEvmHex}
												showAvatar={false}
											/>
										</dd>
									</div>
								{:else if connectionField.custody != null}
									<div>
										<dt>Custody</dt>
										<dd>{connectionField.custody}</dd>
									</div>
								{/if}
								{#if connectionField.signedAt != null}
									<div>
										<dt>Signed in</dt>
										<dd>{new Date(connectionField.signedAt).toISOString()}</dd>
									</div>
								{/if}
							</dl>
							{#if connectionField.pfpUrl != null}
								<p>
									<Icon
										src={connectionField.pfpUrl}
										alt=""
										size="6rem"
									/>
								</p>
							{/if}
							{#if connectionField.verifications != null && connectionField.verifications.length}
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
					id="casts"
					title="Casts"
					href={resolve('/farcaster/feed')}
					parentEntityType={EntityType.FarcasterUser}
					parentEntityId={{
						fid: entityId.fid,
					}}
				/>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
