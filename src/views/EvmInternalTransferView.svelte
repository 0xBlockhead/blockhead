<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'

	import {
		EvmInternalCallType,
		evmInternalCallTypeByCallType,
	} from '$/constants/Evm.ts'

	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
			caip2Namespace: selector.$network.caip2.namespace,
			caip2Reference: selector.$network.caip2.reference,
			transactionId: selector.txHash,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		showParentTransaction = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmInternalTransfer>
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

	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmInternalTransfer}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selector.internalIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Internal transfer </span>
			<span data-badge="small">
				#{selector.internalIndex}
			</span>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Native currency moved inside transaction execution (internal <code>CALL</code> with non-zero value), not the top-level signed envelope amount.
		</p>
	{/snippet}

	{#snippet Content()}
		{@const transfer = subscribe(EntityType.EvmInternalTransfer,
			selector,
			({ sources: [Source.Blockscout_Rest], fields: { value: true, $from: true, $to: true, ...(open && ({ callType: true, success: true, $createdContract: true })) } }),
		)}
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
										href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
											caip2Namespace: selector.$network.caip2.namespace,
											caip2Reference: selector.$network.caip2.reference,
											transactionId: selector.txHash,
										})}
									>
									<TruncatedValue
										value={selector.txHash}
										format={TruncatedValueFormat.Abbr}
									/>
								</a>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Internal index</dt>
						<dd>{String(selector.internalIndex)}</dd>
					</div>

					{#if transfer.fields.callType}
						<div>
							<dt>Call type</dt>
							<dd>{evmInternalCallTypeByCallType[transfer.fields.callType].label}</dd>
						</div>
					{/if}

					{#if transfer.fields.success !== undefined}
						<div>
							<dt>Success</dt>
							<dd>{transfer.fields.success ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if (
						(
							transfer.fields.callType === EvmInternalCallType.Create
							|| transfer.fields.callType === EvmInternalCallType.Create2
						)
						&& transfer.fields.$createdContract
					)}
						<div>
							<dt>Created contract</dt>
							<dd>
								<EvmContractView
									selector={transfer.fields.$createdContract[EntityMetaKey.Selector]}
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
