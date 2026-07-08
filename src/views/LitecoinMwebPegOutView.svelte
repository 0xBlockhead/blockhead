<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebPegOut>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LitecoinMwebPegOut>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const litecoinMwebPegOut = $derived(selection({
		sources: [
			Source.LitecoinCore_JsonRpc,
		],
		fields: {
			$transparentOutput: true,
		},
	}))
	const titleFallback = $derived('litecoin MWEB peg out')
	const viewDomId = $derived('litecoin-mweb-peg-out-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebPegOut}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={litecoinMwebPegOut}>
			{#snippet Pending()}
				<LitecoinMwebTransactionView
					selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<LitecoinMwebTransactionView
					selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={litecoinMwebPegOut}>
			{#snippet Pending()}
				{@const pegOutIndex0 = selection.entitySelector.pegOutIndex ?? prefetched.pegOutIndex}
				{#if pegOutIndex0 !== undefined && pegOutIndex0 !== null}
					<NumberValue value={Number(pegOutIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const pegOutIndex0 = resolvedEntity.pegOutIndex}
				{#if pegOutIndex0 !== undefined && pegOutIndex0 !== null}
					<NumberValue value={Number(pegOutIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={litecoinMwebPegOut}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$transparentOutput}
				>
					{#snippet children(utxoOutput)}
						{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
									href={
										(utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.namespace !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.reference !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
											networkSlug: String(networkByCaip2[String(String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.namespace) + ':' + String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.reference))].slug ?? ''),
											txId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
											outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
										}) : undefined)
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$transparentOutput}
				>
					{#snippet children(utxoOutput)}
						{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
									href={
										(utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.namespace !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.reference !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
											networkSlug: String(networkByCaip2[String(String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.namespace) + ':' + String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.reference))].slug ?? ''),
											txId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
											outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
										}) : undefined)
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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>peg out index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pegOutIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pegOutIndex = selection.entitySelector.pegOutIndex ?? prefetched.pegOutIndex}
							{#if pegOutIndex !== undefined && pegOutIndex !== null}
								<NumberValue value={Number(pegOutIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pegOutIndex = resolvedEntity.pegOutIndex}
							{#if pegOutIndex !== undefined && pegOutIndex !== null}
								<NumberValue value={Number(pegOutIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transparentOutput}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>transparent output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
									href={
										(utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.namespace !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.reference !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
											networkSlug: String(networkByCaip2[String(String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.namespace) + ':' + String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2.reference))].slug ?? ''),
											txId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
											outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountLitoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountLitoshis = prefetched.amountLitoshis}
					{#if amountLitoshis !== undefined && amountLitoshis !== null}
						<div>
							<dt>amount litoshis</dt>
							<dd>
								<NumberValue value={Number(amountLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountLitoshis = resolvedEntity.amountLitoshis}
					{#if amountLitoshis !== undefined && amountLitoshis !== null}
						<div>
							<dt>amount litoshis</dt>
							<dd>
								<NumberValue value={Number(amountLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
