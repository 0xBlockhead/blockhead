<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'

	import {
		EvmInternalCallType,
		evmInternalCallTypeByCallType,
	} from '$/constants/Evm.ts'

	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
			caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
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

	const transfer = $derived(select(EntityType.EvmInternalTransfer, selector, {
		sources: [Source.Blockscout_Rest],
	}))
	const callType = $derived(transfer.callType)
	
	


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
		<dl data-column-item="center">
			{#if showParentTransaction}
				<div>
					<dt>Transaction</dt>
					<dd>
						<a
							href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
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

			<ResourceBoundary
				resource={callType}
				placeholderText="Loading call type…"
			>
				{#snippet children(callType)}
					{#if callType}
						<div>
							<dt>Call type</dt>
							<dd>{evmInternalCallTypeByCallType[callType].label}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transfer.success}
				placeholderText="Loading status…"
			>
				{#snippet children(success)}
					{#if success !== undefined}
						<div>
							<dt>Success</dt>
							<dd>{success ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={callType}
				placeholderText="Loading created contract…"
			>
				{#snippet children(callType)}
					{#if (
						callType === EvmInternalCallType.Create
						|| callType === EvmInternalCallType.Create2
					)}
						<ResourceBoundary
							resource={transfer.$createdContract}
							placeholderText="Loading created contract…"
						>
							{#snippet children(createdContract)}
								{#if createdContract}
									<div>
										<dt>Created contract</dt>
										<dd>
											<EvmContractView
												selector={createdContract.entitySelector}
												layout={EntityLayout.Value}
												open={true}
												showTypeAnnotation={false}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
