<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { evmInternalCallTypes } from '$/constants/Evm.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]/internal/[internalIndex]',
			{
				networkId: String(entityId.$network.chainId),
				transactionId: entityId.$transaction.txHash,
				internalIndex: String(entityId.internalIndex),
			},
		),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		showParentTransaction = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmInternalTransfer>
			href?: string
			layout?: EntityLayout
			open?: boolean
			showParentTransaction?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const transfer = useEntity(
		EntityType.EvmInternalTransfer,
		entityId,
		{
			$: [Source.Blockscout_Rest],
			value: {},
			$from: {},
			$to: {},
			...(open && {
				callType: {},
				success: {},
				$createdContract: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmInternalTransfer}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			#{entityId.internalIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Internal transfer </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Native currency moved inside transaction execution (internal <code>CALL</code> with non-zero value), not the top-level signed envelope amount.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={transfer}
				placeholderText="Loading internal transfer…"
			>
							{#snippet children(loadedTransfer)}

					{#if showParentTransaction}
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
					{/if}

					<div>
						<dt>Internal index</dt>
						<dd>{String(entityId.internalIndex)}</dd>
					</div>

					{#if loadedTransfer.callType}
						<div>
							<dt>Call type</dt>
							<dd>{evmInternalCallTypes[loadedTransfer.callType].label}</dd>
						</div>
					{/if}

					{#if loadedTransfer.success !== undefined}
						<div>
							<dt>Success</dt>
							<dd>{loadedTransfer.success ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if loadedTransfer.$createdContract}
						<div>
							<dt>Created contract</dt>
							<dd>
								<EvmContractView
									entityId={loadedTransfer.$createdContract[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={true}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

			{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.EvmInternalTransfer}
			{entityId}
		/>
	{/snippet}
</EntityView>
