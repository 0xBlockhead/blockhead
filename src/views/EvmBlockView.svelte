<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


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
			entityId: EntityId<typeof schema, EntityType.EvmBlock>
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const block = useEntity(
		EntityType.EvmBlock,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
			timestamp: {},
			gasUsed: {},
			gasLimit: {},
			baseFeePerGas: {},
			transactionCount: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlock}
	{entityId}
	title={`Block ${String(entityId.blockNumber)}`}
	{href}
	idDragPlainText={String(entityId.blockNumber)}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		Block {@render Id()}
	{/snippet}

	{#snippet Id()}
		<span data-row="inline align-center gap-2 wrap">
			<span
				data-badge="small"
				data-text="font-monospace"
				data-block-number={String(entityId.blockNumber)}
			>
				{String(entityId.blockNumber)}
			</span>
		</span>
	{/snippet}

	{#snippet Content({ open })}
		<ResourceBoundary
			resource={block}
			placeholderText="Loading block…"
		>
			{#snippet children(block)}
				<dl>
					{#if entityId.hash || block.hash}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={entityId.hash || block.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
					{#if block.transactionCount !== undefined}
						<div>
							<dt>Transactions</dt>
							<dd>
								<NumberValue value={block.transactionCount} />
							</dd>
						</div>
					{/if}
					{#if block.timestamp !== undefined}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp
									timestamp={block.timestamp}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}
					{#if open && block.gasUsed !== undefined}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue value={block.gasUsed} />
							</dd>
						</div>
					{/if}
					{#if open && block.gasLimit !== undefined}
						<div>
							<dt>Gas limit</dt>
							<dd>
								<NumberValue value={block.gasLimit} />
							</dd>
						</div>
					{/if}
					{#if open && block.baseFeePerGas !== undefined}
						<div>
							<dt>Base fee</dt>
							<dd>
								<NumberValue value={block.baseFeePerGas} />
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.EvmBlock}
			{entityId}
		/>

		<EvmTransactionsView
			entityFieldReference={{
				entityType: EntityType.EvmBlock,
				entityId,
				fieldName: '$$transactions',
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/transactions',
				{
					networkId: String(entityId.$network.chainId),
					blockNumber: String(entityId.blockNumber),
				},
			)}
			id="transactions"
			open={false}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
