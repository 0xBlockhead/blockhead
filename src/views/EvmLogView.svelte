<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { normalizeEvmTopicHex } from '$/lib/signature-paths.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	let {
		selector,
		href,
		layout = EntityLayout.SummaryDetails,
		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
		),
		showParentTransaction = true,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmLog>
			href?: string
			layout?: EntityLayout
			summaryUsesHeading?: boolean
			showParentTransaction?: boolean
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const log = $derived(
		subscribe(EntityType.EvmLog,
			selector,
			({ fields: { topics: true, ...(open && ({ data: true, $emitter: true, $$tokenTransfers: true })) } }),
		),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmLogDecode from '$/views/EvmLogDecode.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmLog}
	entitySelector={selector}
	href={href ?? resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[logIndex=nonNegativeInteger]', {
		caip2Namespace: selector.$network.caip2.namespace,
		caip2Reference: selector.$network.caip2.reference,
		transactionId: selector.txHash,
		logIndex: String(selector.logIndex),
	})}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selector.logIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={log}
			placeholderText="Loading receipt log…"
		>
			{#snippet children(log)}
				<span data-row="wrap gap-2 align-baseline">
					<span data-row="inline align-center gap-2 wrap">
						<span>Receipt log </span>
						<span data-badge="small">
							#{selector.logIndex}
						</span>
					</span>
					{#if log.fields.topics?.[0]?.startsWith('0x')}
						{@const topic0Hex = normalizeEvmTopicHex(log.fields.topics[0])}
						<EvmTopicView
							selector={{ hex: topic0Hex }}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/if}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Each <code>LOG</code> opcode on a mined transaction appends one receipt log row: emitter contract, indexed topics, and ABI-encoded data.
		</p>
		<p>
			Topic 0 often fingerprints an ABI log declaration (Solidity/Vyper); raw <code>LOG</code> emissions may use topics differently.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<div data-column="gap-1">
			<dl data-column-item="center">
				{#if showParentTransaction}
					<div>
						<dt>Transaction</dt>
						<dd>
							<a
								data-text="font-monospace"
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

				<ResourceBoundary
					resource={log}
					placeholderText="Loading receipt log…"
				>
					{#snippet children(log)}
						{#if log.fields.$emitter}
							<div>
								<dt>Emitter contract</dt>
								<dd>
									<EvmContractView
										selector={log.fields.$emitter[EntityMetaKey.Selector]}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if log.fields.topics?.length}
							<div>
								<dt>Topics</dt>
								<dd>
									<ul>
										{#each log.fields.topics as topic, topicIndex (`${topicIndex}:${topic ?? ''}`)}
											<li>
												<span data-text="muted">topic {topicIndex}</span>
												{#if topic?.startsWith('0x')}
													{@const topicHex = normalizeEvmTopicHex(topic)}
													{#if topicIndex === 0 && summaryUsesHeading}
														<TruncatedValue
															value={topic}
															format={TruncatedValueFormat.Abbr}
														/>
													{:else}
														<a
															data-text="font-monospace"
															href={resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', {
																hex: topicHex,
															})}
														>
															<TruncatedValue
																value={topic}
																format={TruncatedValueFormat.Abbr}
															/>
														</a>
													{/if}
												{:else if topic != null}
													<code>{topic}</code>
												{/if}
											</li>
										{/each}
									</ul>
								</dd>
							</div>
						{/if}

						{#if log.fields.data}
							<div>
								<dt>Data</dt>
								<dd>
									<TruncatedValue
										value={log.fields.data}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if log.fields.$$tokenTransfers?.values.length}
							<div>
								<dt>Token transfers</dt>
								<dd>
									<EvmTokenTransfersView
										entityFieldReference={{
											entityType: EntityType.EvmLog,
											selector,
											fieldName: '$$tokenTransfers',
										}}
										open={true}
									/>
								</dd>
							</div>
						{/if}

						{#if log.fields.topics?.length && log.fields.data != null && contentOpen}
							<div>
								<dt>ABI decode</dt>
								<dd>
									<EvmLogDecode
										topics={log.fields.topics}
										data={log.fields.data}
										emitterContractId={log.fields.$emitter?.[EntityMetaKey.Selector]}
										open={contentOpen}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			</dl>
		</div>
	{/snippet}
</EntityView>
