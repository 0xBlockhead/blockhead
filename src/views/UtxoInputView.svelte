<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.UtxoInput>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.UtxoInput>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const utxoInput = $derived(selection({
		fields: {
			$spentOutput: true,
			coinbaseScript: true,
			scriptSigAsm: true,
			sequence: true,
			witness: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') ? 'Input #' + String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') : '') || 'UTXO input')
	const viewDomId = $derived('utxo-input-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoInput}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/input/[inputIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2)].slug),
			txId: String(({ ...selection.entitySelector, ...prefetched }).$transaction.txId),
			inputIndex: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Input </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.UtxoOutput, false>('$spentOutput')}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null}
						<span data-text="muted">
							<UtxoOutputView
								selection={select(EntityType.UtxoOutput, utxoOutput.entitySelector)}
								prefetched={utxoOutput}
								href={
									resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
										networkSlug: String(networkByCaip2[String(utxoOutput.entitySelector.$transaction.$network.caip2)].slug),
										txId: String(utxoOutput.entitySelector.$transaction.txId),
										outputIndex: String(utxoOutput.entitySelector.indexInTransaction),
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={utxoInput}>
				{#snippet Pending()}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.UtxoOutput, false>('$spentOutput')}
					>
						{#snippet children(utxoOutput)}
							{#if utxoOutput != null}
								<span data-text="muted">
									<UtxoOutputView
										selection={select(EntityType.UtxoOutput, utxoOutput.entitySelector)}
										prefetched={utxoOutput}
										href={
											resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
												networkSlug: String(networkByCaip2[String(utxoOutput.entitySelector.$transaction.$network.caip2)].slug),
												txId: String(utxoOutput.entitySelector.$transaction.txId),
												outputIndex: String(utxoOutput.entitySelector.indexInTransaction),
											})
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(entity)}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.UtxoOutput, false>('$spentOutput')}
					>
						{#snippet children(utxoOutput)}
							{#if utxoOutput != null}
								<span data-text="muted">
									<UtxoOutputView
										selection={select(EntityType.UtxoOutput, utxoOutput.entitySelector)}
										prefetched={utxoOutput}
										href={
											resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
												networkSlug: String(networkByCaip2[String(utxoOutput.entitySelector.$transaction.$network.caip2)].slug),
												txId: String(utxoOutput.entitySelector.$transaction.txId),
												outputIndex: String(utxoOutput.entitySelector.indexInTransaction),
											})
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in transaction</dt>
				<dd>
					<ResourceBoundary resource={utxoInput}>
						{#snippet Pending()}
							{@const indexInTransaction = prefetched.indexInTransaction ?? selection.entitySelector.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const indexInTransaction = entity.indexInTransaction ?? selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]', {
								networkSlug: String(selection.entitySelector.$transaction.$network.slug),
								txId: String(selection.entitySelector.$transaction.txId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={utxoInput}>
				{#snippet Pending()}
					{@const coinbaseScript = prefetched.coinbaseScript ?? selection.entitySelector.coinbaseScript}
					{#if coinbaseScript !== undefined && coinbaseScript !== null}
						<div>
							<dt>Coinbase script</dt>
							<dd>
								{String((coinbaseScript) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const coinbaseScript = entity.coinbaseScript ?? selection.entitySelector.coinbaseScript ?? prefetched.coinbaseScript}
					{#if coinbaseScript !== undefined && coinbaseScript !== null}
						<div>
							<dt>Coinbase script</dt>
							<dd>
								{String((coinbaseScript) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoInput}>
				{#snippet Pending()}
					{@const scriptSigAsm = prefetched.scriptSigAsm ?? selection.entitySelector.scriptSigAsm}
					{#if scriptSigAsm !== undefined && scriptSigAsm !== null}
						<div>
							<dt>Script sig asm</dt>
							<dd>
								{String((scriptSigAsm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const scriptSigAsm = entity.scriptSigAsm ?? selection.entitySelector.scriptSigAsm ?? prefetched.scriptSigAsm}
					{#if scriptSigAsm !== undefined && scriptSigAsm !== null}
						<div>
							<dt>Script sig asm</dt>
							<dd>
								{String((scriptSigAsm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoInput}>
				{#snippet Pending()}
					{@const sequence = prefetched.sequence ?? selection.entitySelector.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sequence = entity.sequence ?? selection.entitySelector.sequence ?? prefetched.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Witness</dt>
				<dd>
					<ResourceBoundary resource={utxoInput}>
						{#snippet Pending()}
							{@const witness = prefetched.witness ?? selection.entitySelector.witness}
							{#if witness !== undefined && witness !== null}
								{String((witness) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const witness = entity.witness ?? selection.entitySelector.witness ?? prefetched.witness}
							{#if witness !== undefined && witness !== null}
								{String((witness) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
