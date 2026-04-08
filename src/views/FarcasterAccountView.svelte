<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


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
					verifications.filter((value): value is string => typeof value === 'string' && value.length)
				:	undefined,
				signedAt: typeof signedAt === 'number' ? signedAt : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		connectionField?.displayName
		?? connectionField?.username
		?? String(entityId.fid),
	)

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryHeadingAfter()}
		{#if connectionField?.username != null && connectionField.username !== displayTitle}
			<span data-text="muted">
				@{connectionField.username}
			</span>
		{/if}
	{/snippet}

	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>FID</dt>
				<dd>{String(entityId.fid)}</dd>
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
							{#if connectionField.displayName != null}
								<div>
									<dt>Display name</dt>
									<dd>{connectionField.displayName}</dd>
								</div>
							{/if}
							{#if connectionField.username != null}
								<div>
									<dt>Username</dt>
									<dd>{connectionField.username}</dd>
								</div>
							{/if}
							{#if connectionField.pfpUrl != null}
								<div>
									<dt>PFP URL</dt>
									<dd>{connectionField.pfpUrl}</dd>
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
									<dt>Auth method</dt>
									<dd>{connectionField.authMethod}</dd>
								</div>
							{/if}
							{#if connectionField.custody != null}
								<div>
									<dt>Custody</dt>
									<dd>{connectionField.custody}</dd>
								</div>
							{/if}
							{#if connectionField.verifications != null && connectionField.verifications.length}
								<div>
									<dt>Verifications</dt>
									<dd>{connectionField.verifications.join(', ')}</dd>
								</div>
							{/if}
							{#if connectionField.signedAt != null}
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

