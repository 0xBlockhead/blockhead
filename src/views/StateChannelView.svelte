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
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.StateChannel>
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
		>
	> = $props()


	const stateChannelIdKey = $derived(
		stringify(entityId),
	)

	const stateChannelQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.StateChannel] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						stateChannelIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => stateChannelIdKey],
	)

	const stateChannelRow = $derived(
		stateChannelQuery.data?.[0]?.row,
	)

	const stateChannelField = $derived(
		(() => {
			const bag = stateChannelRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const bigString = (v: unknown) => (
				typeof v === 'bigint' ?
					String(v)
				: typeof v === 'string' && /^-?\d+$/.test(v) ?
					v
				: typeof v === 'number' && Number.isFinite(v) ?
					String(BigInt(Math.trunc(v)))
				:
					undefined
			)
			return {
				totalDeposited: bigString(b.totalDeposited),
				balance0: bigString(b.balance0),
				balance1: bigString(b.balance1),
				turnNum: typeof b.turnNum === 'number' && Number.isFinite(b.turnNum) ? b.turnNum : undefined,
				status: typeof b.status === 'string' && b.status.length ? b.status : undefined,
				createdAt: typeof b.createdAt === 'number' && Number.isFinite(b.createdAt) ? b.createdAt : undefined,
				updatedAt: typeof b.updatedAt === 'number' && Number.isFinite(b.updatedAt) ? b.updatedAt : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		stateChannelField?.status
		?? (
			stateChannelField?.turnNum != null ?
				`Turn ${String(stateChannelField.turnNum)}`
			: undefined
		)
		?? stateChannelField?.totalDeposited
		?? `Channel ${entityId.id}`,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannel}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Channel id</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if stateChannelField?.status != null}
				<div>
					<dt>Status</dt>
					<dd>{stateChannelField.status}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.StateChannel}
				{entityId}
			>
				<QueryBoundary
					query={stateChannelQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No state channel row in collections yet (no resolver for this channel id).
						</p>
					{:else}
						<dl>
							{#if stateChannelField?.totalDeposited != null}
								<div>
									<dt>Total deposited</dt>
									<dd>{stateChannelField.totalDeposited}</dd>
								</div>
							{/if}
							{#if stateChannelField?.balance0 != null}
								<div>
									<dt>Balance 0</dt>
									<dd>{stateChannelField.balance0}</dd>
								</div>
							{/if}
							{#if stateChannelField?.balance1 != null}
								<div>
									<dt>Balance 1</dt>
									<dd>{stateChannelField.balance1}</dd>
								</div>
							{/if}
							{#if stateChannelField?.turnNum != null}
								<div>
									<dt>Turn</dt>
									<dd>{String(stateChannelField.turnNum)}</dd>
								</div>
							{/if}
							{#if stateChannelField?.status != null}
								<div>
									<dt>Status</dt>
									<dd>{stateChannelField.status}</dd>
								</div>
							{/if}
							{#if stateChannelField?.createdAt != null}
								<div>
									<dt>Created at</dt>
									<dd>{String(stateChannelField.createdAt)}</dd>
								</div>
							{/if}
							{#if stateChannelField?.updatedAt != null}
								<div>
									<dt>Updated at</dt>
									<dd>{String(stateChannelField.updatedAt)}</dd>
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
