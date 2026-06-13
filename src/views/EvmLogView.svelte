<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { getEvmTopicPath, normalizeEvmTopicHex } from '$/lib/signature-paths.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	let {
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]/log/[logIndex]', {
			caip2Namespace: entityId.$network.caip2.namespace,
			caip2Reference: entityId.$network.caip2.reference,
			transactionId: entityId.txHash,
			logIndex: String(entityId.logIndex),
		}),
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
			entityId: EntityId<typeof schema, EntityType.EvmLog>
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

	const log = subscribe(EntityType.EvmLog,
		entityId,
		({ sources: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			], fields: { topics: true, ...(open && ({ data: true, $emitter: true, $$tokenTransfers: true })) } }),
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
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{entityId.logIndex}
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
							#{entityId.logIndex}
						</span>
					</span>
					{#if log.fields.topics?.[0]?.startsWith('0x')}
						{@const topic0Hex = normalizeEvmTopicHex(log.fields.topics[0])}
						<EvmTopicView
							entityId={{ hex: topic0Hex }}
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
								href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
									caip2Namespace: entityId.$network.caip2.namespace,
									caip2Reference: entityId.$network.caip2.reference,
									transactionId: entityId.txHash,
								})}
							>
								<TruncatedValue
									value={entityId.txHash}
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
										entityId={log.fields.$emitter[EntityMetaKey.Id]}
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
														<a data-text="font-monospace" href={getEvmTopicPath(topicHex)}>
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
											entityId,
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
										emitterContractId={log.fields.$emitter?.[EntityMetaKey.Id]}
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
