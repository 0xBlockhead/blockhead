<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { normalizeEvmTopicHex } from '$/lib/signature-paths.ts'
	import { select } from '$/routes/+layout.svelte'

	let {
		selection,
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmLog>
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


	const log = $derived(selection())
	const topics = $derived(log.topics)
	const data = $derived(log.data)
	const emitter = $derived(log.$emitter)
	const tokenTransfers = $derived(log.$$tokenTransfers)



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
	entitySelector={selection.entitySelector}
	href={href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[logIndex=nonNegativeInteger]', {
		caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
		transactionId: selection.entitySelector.txHash,
		logIndex: String(selection.entitySelector.logIndex),
	})}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.logIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={topics}
			placeholderText="Loading receipt log…"
		>
			{#snippet children(topics)}
				<span data-row="wrap gap-2 align-baseline">
					<span data-row="inline align-center gap-2 wrap">
						<span>Receipt log </span>
						<span data-badge="small">#{selection.entitySelector.logIndex}</span>
					</span>
					{#if topics?.[0]?.startsWith('0x')}
						{@const topic0Hex = normalizeEvmTopicHex(topics[0])}
						<EvmTopicView
							selection={select(EntityType.EvmTopic, { hex: topic0Hex })}
							layout={EntityLayout.Title}

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
								href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
									caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
									transactionId: selection.entitySelector.txHash,
								})}
							>
								<TruncatedValue value={selection.entitySelector.txHash} format={TruncatedValueFormat.Abbr} />
							</a>
						</dd>
					</div>
				{/if}

				<ResourceBoundary resource={emitter} placeholderText="Loading emitter contract…">
					{#snippet children(emitter)}
						{#if emitter}
							<div>
								<dt>Emitter contract</dt>
								<dd>
									<EvmContractView
										selection={select(EntityType.EvmContract, emitter.entitySelector)}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
										open={false}
										/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={topics} placeholderText="Loading receipt log topics…">
					{#snippet children(topics)}
						{#if topics?.length}
							<div>
								<dt>Topics</dt>
								<dd>
									<ul>
										{#each topics as topic, topicIndex (`${topicIndex}:${topic ?? ''}`)}
											<li>
												<span data-text="muted">topic {topicIndex}</span>
												{#if topic?.startsWith('0x')}
													{@const topicHex = normalizeEvmTopicHex(topic)}
													{#if topicIndex === 0 && summaryUsesHeading}
														<TruncatedValue value={topic} format={TruncatedValueFormat.Abbr} />
													{:else}
														<a
															data-text="font-monospace"
															href={resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', { hex: topicHex })}
														>
															<TruncatedValue value={topic} format={TruncatedValueFormat.Abbr} />
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
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={data} placeholderText="Loading log data…">
					{#snippet children(data)}
						{#if data}
							<div>
								<dt>Data</dt>
								<dd><TruncatedValue value={data} format={TruncatedValueFormat.Visual} /></dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={tokenTransfers} placeholderText="Loading token transfers…">
					{#snippet children(tokenTransfers)}
						{#if tokenTransfers.values.length}
							<div>
								<dt>Token transfers</dt>
								<dd>
									<EvmTokenTransfersView
										selection={selection.$$tokenTransfers}
										open={true}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				{#if contentOpen}
					<ResourceBoundary resource={topics} placeholderText="Loading decode topics…">
						{#snippet children(topics)}
							<ResourceBoundary resource={data} placeholderText="Loading decode data…">
								{#snippet children(data)}
									{#if topics?.length && data != null}
										<div>
											<dt>ABI decode</dt>
											<dd>
												<EvmLogDecode
													topics={topics}
													{data}
													emitterContractId={emitter?.entitySelector}
													open={contentOpen}
												/>
											</dd>
										</div>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}
					</ResourceBoundary>
				{/if}
			</dl>
		</div>
	{/snippet}

</EntityView>
