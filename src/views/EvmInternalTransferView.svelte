<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import {
		EvmInternalCallType,
		evmInternalCallTypeByCallType,
	} from '$/constants/Evm.ts'

	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		href = `/network/${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}/tx/${entityId.txHash}`,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		showParentTransaction = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmInternalTransfer>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
			showParentTransaction?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

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
				$case: {
					callType: {
						[EvmInternalCallType.Create]: {
							$createdContract: {},
						},
						[EvmInternalCallType.Create2]: {
							$createdContract: {},
						},
					},
				},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmInternalTransfer}
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{entityId.internalIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Internal transfer </span>
			<span data-badge="small">
				#{entityId.internalIndex}
			</span>
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
				{#snippet children(transfer)}

					{#if showParentTransaction}
						<div>
							<dt>Transaction</dt>
							<dd>
								<a
									href={`/network/${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}/tx/${entityId.txHash}`}
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

					{#if transfer.callType}
						<div>
							<dt>Call type</dt>
							<dd>{evmInternalCallTypeByCallType[transfer.callType].label}</dd>
						</div>
					{/if}

					{#if transfer.success !== undefined}
						<div>
							<dt>Success</dt>
							<dd>{transfer.success ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if (
						(
							transfer.callType === EvmInternalCallType.Create
							|| transfer.callType === EvmInternalCallType.Create2
						)
						&& transfer.$createdContract
					)}
						<div>
							<dt>Created contract</dt>
							<dd>
								<EvmContractView
									entityId={transfer.$createdContract[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
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
</EntityView>
