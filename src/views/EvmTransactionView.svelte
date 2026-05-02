<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Transaction',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmTransaction>
			title?: string
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

	const txIdKey = $derived(
		stringify(entityId),
	)

	const transactionQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EvmTransaction] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						txIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => txIdKey],
	)

	const txRow = $derived(
		(
			transactionQuery.data?.find(
				(r) => r.row[EntityMetaKey.Source] === Source.Blockscout_Rest,
			)?.row
			?? transactionQuery.data?.[0]?.row
		)
	)

	const txField = $derived(
		(() => {
			const bag = txRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				value: typeof b.value === 'bigint' ? b.value : undefined,
				nonce: typeof b.nonce === 'number' ? b.nonce : undefined,
				transactionIndex: typeof b.transactionIndex === 'number' ? b.transactionIndex : undefined,
				gas: typeof b.gas === 'bigint' ? b.gas : undefined,
				gasPrice: typeof b.gasPrice === 'bigint' ? b.gasPrice : undefined,
				type: typeof b.type === 'number' ? b.type : undefined,
				status: typeof b.status === 'number' ? b.status : undefined,
				gasUsed: typeof b.gasUsed === 'bigint' ? b.gasUsed : undefined,
				effectiveGasPrice: typeof b.effectiveGasPrice === 'bigint' ? b.effectiveGasPrice : undefined,
			}
		})(),
	)

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTransaction}
	{entityId}
	{title}
	{href}
	idDragPlainText={entityId.txHash}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span
			data-text="font-monospace"
			data-tx-hash={entityId.txHash}
		>
			<TruncatedValue
				value={entityId.txHash}
				format={TruncatedValueFormat.Abbr}
			/>
		</span>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.EvmTransaction}
			{entityId}
		>
			<QueryBoundary
				query={transactionQuery}
			>

				{#snippet children(rows)}
				{@const txRow = (
					rows?.find(
						(r) => r.row[EntityMetaKey.Source] === Source.Blockscout_Rest,
					)?.row
					?? rows?.[0]?.row
				)}
				{#if txRow === undefined}
					<p data-text="muted">
						No transaction data for this hash yet.
					</p>
				{:else}
					<dl>
						{#if txField?.value !== undefined}
							<div>
								<dt>Value</dt>
								<dd>{String(txField.value)}</dd>
							</div>
						{/if}
						{#if txField?.nonce !== undefined}
							<div>
								<dt>Nonce</dt>
								<dd>{String(txField.nonce)}</dd>
							</div>
						{/if}
						{#if txField?.transactionIndex !== undefined}
							<div>
								<dt>Index</dt>
								<dd>{String(txField.transactionIndex)}</dd>
							</div>
						{/if}
						{#if txField?.gas !== undefined}
							<div>
								<dt>Gas</dt>
								<dd>{String(txField.gas)}</dd>
							</div>
						{/if}
						{#if txField?.gasPrice !== undefined}
							<div>
								<dt>Gas price</dt>
								<dd>{String(txField.gasPrice)}</dd>
							</div>
						{/if}
						{#if txField?.type !== undefined}
							<div>
								<dt>Type</dt>
								<dd>{String(txField.type)}</dd>
							</div>
						{/if}
						{#if txField?.status !== undefined}
							<div>
								<dt>Status</dt>
								<dd>{String(txField.status)}</dd>
							</div>
						{/if}
						{#if txField?.gasUsed !== undefined}
							<div>
								<dt>Gas used</dt>
								<dd>{String(txField.gasUsed)}</dd>
							</div>
						{/if}
						{#if txField?.effectiveGasPrice !== undefined}
							<div>
								<dt>Effective gas price</dt>
								<dd>{String(txField.effectiveGasPrice)}</dd>
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
