<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EvmLogInterpretationKind, evmLogInterpretationKindByInterpretationKind } from '$/constants/Evm.ts'
	import { stringify } from 'devalue'


	// State
	let {
		entityId,
		href = `/network/${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}/tx/${entityId.txHash}/log/${entityId.logIndex}`,
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

	import { getEvmTopicPath, normalizeEvmTopicHex } from '$/lib/signature-paths.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const log = useEntity(
		EntityType.EvmLog,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
			topics: {},
			interpretationKind: {},
			...(open && {
				address: {},
				data: {},
				$emitter: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmLogDecode from '$/views/EvmLogDecode.svelte'
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
					{#if log.topics?.[0]?.startsWith('0x')}
						{@const topic0Hex = normalizeEvmTopicHex(log.topics[0])}
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

				<ResourceBoundary
					resource={log}
					placeholderText="Loading receipt log…"
				>
					{#snippet children(log)}
					{#if log.interpretationKind != null && log.interpretationKind !== EvmLogInterpretationKind.Unknown}
						<div>
							<dt>Interpretation</dt>
							<dd>{evmLogInterpretationKindByInterpretationKind[log.interpretationKind].label}</dd>
						</div>
					{/if}
					{#if log.$emitter}
						<div>
							<dt>Emitter contract</dt>
							<dd>
								<EvmContractView
									entityId={log.$emitter[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{:else if log.address}
						<div>
							<dt>Emitter contract</dt>
							<dd>
								<EvmContractView
									entityId={{
										$network: entityId.$network,
										address: log.address,
									}}
									layout={EntityLayout.Value}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
					{#if log.topics?.length}
						<div>
							<dt>Topics</dt>
							<dd>
								<ul>
									{#each log.topics as topic, topicIndex (`${topicIndex}:${topic ?? ''}`)}
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
														href={getEvmTopicPath(topicHex)}
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
					{#if log.data}
						<div>
							<dt>Data</dt>
							<dd>
								<TruncatedValue
									value={log.data}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
					{#if log.topics?.length && log.data != null && contentOpen}
						<div>
							<dt>ABI decode</dt>
							<dd>
								<EvmLogDecode
									topics={log.topics}
									data={log.data}
									emitterContractId={log.$emitter?.[EntityMetaKey.Id]}
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
