<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


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
			| 'Summary'
		>
	> = $props()


	const txIdKey = $derived(
		stringify(entityId),
	)

	const chainId = $derived(
		typeof entityId?.$network?.chainId === 'number' ?
			entityId.$network.chainId
		:	undefined,
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
				(r) => r.row[EntityMetaKey.Source] === Source.Blockscout,
			)?.row
			?? transactionQuery.data?.[0]?.row
		)
	)

	const txField = $derived(
		(() => {
			const bag = txRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
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
	{open}
	{...entityViewRest}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Hash</dt>
				<dd>
					<TruncatedValue
						value={entityId.txHash}
						format={TruncatedValueFormat.Abbr}
					/>
				</dd>
			</div>
			{#if chainId != null}
				<div>
					<dt>Chain ID</dt>
					<dd>{String(chainId)}</dd>
				</div>
			{/if}
		</dl>
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
						(r) => r.row[EntityMetaKey.Source] === Source.Blockscout,
					)?.row
					?? rows?.[0]?.row
				)}
				{#if txRow == null}
					<p data-text="muted">
						No transaction row in collections yet (resolve Blockscout / RPC for this hash).
					</p>
				{:else}
					<dl>
						{#if txField?.value != null}
							<div>
								<dt>Value</dt>
								<dd>{String(txField.value)}</dd>
							</div>
						{/if}
						{#if txField?.nonce != null}
							<div>
								<dt>Nonce</dt>
								<dd>{String(txField.nonce)}</dd>
							</div>
						{/if}
						{#if txField?.transactionIndex != null}
							<div>
								<dt>Index</dt>
								<dd>{String(txField.transactionIndex)}</dd>
							</div>
						{/if}
						{#if txField?.gas != null}
							<div>
								<dt>Gas</dt>
								<dd>{String(txField.gas)}</dd>
							</div>
						{/if}
						{#if txField?.gasPrice != null}
							<div>
								<dt>Gas price</dt>
								<dd>{String(txField.gasPrice)}</dd>
							</div>
						{/if}
						{#if txField?.type != null}
							<div>
								<dt>Type</dt>
								<dd>{String(txField.type)}</dd>
							</div>
						{/if}
						{#if txField?.status != null}
							<div>
								<dt>Status</dt>
								<dd>{String(txField.status)}</dd>
							</div>
						{/if}
						{#if txField?.gasUsed != null}
							<div>
								<dt>Gas used</dt>
								<dd>{String(txField.gasUsed)}</dd>
							</div>
						{/if}
						{#if txField?.effectiveGasPrice != null}
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
