<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


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
			entityId: EntityId<typeof schema, EntityType.EvmBlob>
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

	const blobIdKey = $derived(
		stringify(entityId),
	)

	const blobQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EvmBlob] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						blobIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => blobIdKey],
	)

	const blobRow = $derived(
		blobQuery.data?.[0]?.row,
	)

	const blobField = $derived(
		(() => {
			const bag = blobRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				versionedHash: typeof b.versionedHash === 'string' && b.versionedHash.length > 0 ?
					b.versionedHash
				:	undefined,
			}
		})(),
	)

	const blobTitle = $derived(
		`Blob ${String(entityId.blobIndex)}`,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlob}
	{entityId}
	title={blobTitle}
	{href}
	idDragPlainText={blobIdKey}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-row="inline align-center gap-2 wrap">
			<span
				data-badge="small"
				data-text="font-monospace"
			>
				#{String(entityId.blobIndex)}
			</span>
			{#if blobField?.versionedHash !== undefined}
				<small>
					<TruncatedValue
						value={blobField.versionedHash}
						format={TruncatedValueFormat.Abbr}
					/>
				</small>
			{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		{#if blobField?.versionedHash !== undefined}
			<dl>
				<div>
					<dt>Versioned hash</dt>
					<dd>
						<TruncatedValue
							value={blobField.versionedHash}
							format={TruncatedValueFormat.Abbr}
						/>
					</dd>
				</div>
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.EvmBlob}
			{entityId}
		>
			<QueryBoundary
				query={blobQuery}
			>
				{#snippet children(rows)}
					{@const row = rows?.[0]?.row}
					{#if row === undefined}
						<p data-text="muted">
							No blob data for this commitment yet. Try again shortly.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Blob index</dt>
								<dd>
									<NumberValue value={entityId.blobIndex} />
								</dd>
							</div>
							<div>
								<dt>Transaction</dt>
								<dd>
									<a
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
											{
												networkId: String(entityId.$network.chainId),
												transactionId: entityId.txHash,
											},
										)}
									>
										<TruncatedValue
											value={entityId.txHash}
											format={TruncatedValueFormat.Abbr}
										/>
									</a>
								</dd>
							</div>
							{#if blobField?.versionedHash !== undefined}
								<div>
									<dt>Versioned hash</dt>
									<dd>
										<TruncatedValue
											value={blobField.versionedHash}
											format={TruncatedValueFormat.Abbr}
										/>
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
