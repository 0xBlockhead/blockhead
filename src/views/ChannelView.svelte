<script lang="ts">
	// Types/constants
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
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
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			const bigString = (v: JsonValue) => (
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

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannel}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={stateChannelField?.status ?? (stateChannelField?.turnNum !== undefined ? `Turn ${String(stateChannelField.turnNum)}` : undefined) ?? stateChannelField?.totalDeposited ?? `Channel ${entityId.id}`}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Channel id</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if stateChannelField?.status !== undefined}
				<div>
					<dt>Status</dt>
					<dd>{stateChannelField.status}</dd>
				</div>
			{/if}
			{@const chTs = (
				stateChannelField?.updatedAt
				?? stateChannelField?.createdAt
			)}
			{#if chTs !== undefined && typeof chTs === 'number' && Number.isFinite(chTs)}
				<div>
					<dt>Timestamp</dt>
					<dd>
						<Timestamp
							timestamp={chTs}
							format={TimestampFormat.Both}
						/>
					</dd>
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
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No state channel data for this id yet.
						</p>
					{:else}
						<dl>
							{#if stateChannelField?.totalDeposited !== undefined}
								<div>
									<dt>Total deposited</dt>
									<dd>{stateChannelField.totalDeposited}</dd>
								</div>
							{/if}
							{#if stateChannelField?.balance0 !== undefined}
								<div>
									<dt>Balance 0</dt>
									<dd>{stateChannelField.balance0}</dd>
								</div>
							{/if}
							{#if stateChannelField?.balance1 !== undefined}
								<div>
									<dt>Balance 1</dt>
									<dd>{stateChannelField.balance1}</dd>
								</div>
							{/if}
							{#if stateChannelField?.turnNum !== undefined}
								<div>
									<dt>Turn</dt>
									<dd>{String(stateChannelField.turnNum)}</dd>
								</div>
							{/if}
							{#if stateChannelField?.status !== undefined}
								<div>
									<dt>Status</dt>
									<dd>{stateChannelField.status}</dd>
								</div>
							{/if}
							{#if stateChannelField?.createdAt !== undefined && typeof stateChannelField.createdAt === 'number' && Number.isFinite(stateChannelField.createdAt)}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={stateChannelField.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
							{#if stateChannelField?.updatedAt !== undefined && typeof stateChannelField.updatedAt === 'number' && Number.isFinite(stateChannelField.updatedAt)}
								<div>
									<dt>Updated at</dt>
									<dd>
										<Timestamp
											timestamp={stateChannelField.updatedAt}
											format={TimestampFormat.Both}
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
