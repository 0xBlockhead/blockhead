<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoBlock>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.UtxoBlock>>
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
	const utxoBlock = $derived(selection({
		fields: {
			transactionCount: true,
		},
	}))
	const titleFallback = $derived((String((selection.entitySelector.height ?? prefetched.height) ?? '') ? 'Block #' + String((selection.entitySelector.height ?? prefetched.height) ?? '') : '') || [String((prefetched.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block')
	const viewDomId = $derived('utxo-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.height ?? prefetched.height ?? '')}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.height !== undefined && pendingEntity.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$network.caip2.namespace) + ':' + String(pendingEntity.$network.caip2.reference))].slug ?? ''),
			height: String(pendingEntity.height ?? ''),
			hash: String(pendingEntity.hash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.height ?? prefetched.height}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Block </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{:else}
			{[String((prefetched.hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = selection.entitySelector.height ?? prefetched.height}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{:else}
			{[String((prefetched.hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={utxoBlock}>
			{#snippet Pending()}
				{@const transactionCount0 = prefetched.transactionCount}
				{#if transactionCount0 !== undefined && transactionCount0 !== null}
					<span data-text="muted">
						{String((transactionCount0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const transactionCount0 = resolvedEntity.transactionCount}
				{#if transactionCount0 !== undefined && transactionCount0 !== null}
					<span data-text="muted">
						{String((transactionCount0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									height: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const height = selection.entitySelector.height ?? prefetched.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const height = resolvedEntity.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hash = prefetched.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionCount = prefetched.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionCount = resolvedEntity.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							merkleRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const merkleRoot = prefetched.merkleRoot}
					{#if merkleRoot !== undefined && merkleRoot !== null}
						<div>
							<dt>Merkle root</dt>
							<dd>
								{String((merkleRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const merkleRoot = resolvedEntity.merkleRoot}
					{#if merkleRoot !== undefined && merkleRoot !== null}
						<div>
							<dt>Merkle root</dt>
							<dd>
								{String((merkleRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonce = prefetched.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								{String((nonce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								{String((nonce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const difficulty = prefetched.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>Difficulty</dt>
							<dd>
								{String((difficulty) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const difficulty = resolvedEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>Difficulty</dt>
							<dd>
								{String((difficulty) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sizeBytes = prefetched.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>Size</dt>
							<dd>
								{String((sizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sizeBytes = resolvedEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>Size</dt>
							<dd>
								{String((sizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							weightUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const weightUnits = prefetched.weightUnits}
					{#if weightUnits !== undefined && weightUnits !== null}
						<div>
							<dt>Weight</dt>
							<dd>
								{String((weightUnits) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const weightUnits = resolvedEntity.weightUnits}
					{#if weightUnits !== undefined && weightUnits !== null}
						<div>
							<dt>Weight</dt>
							<dd>
								{String((weightUnits) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.UtxoBlock, false>('$parent')}
			>
				{#snippet children(utxoBlock)}
					{#if utxoBlock != null && utxoBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<UtxoBlockView
									selection={select(EntityType.UtxoBlock, utxoBlock[EntityMetaKey.Selector])}
									prefetched={utxoBlock}
									href={
										(utxoBlock[EntityMetaKey.Selector].$network !== undefined && utxoBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoBlock[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && utxoBlock[EntityMetaKey.Selector].$network !== undefined && utxoBlock[EntityMetaKey.Selector].$network.caip2 !== undefined && utxoBlock[EntityMetaKey.Selector].$network.caip2.reference !== undefined && utxoBlock[EntityMetaKey.Selector].height !== undefined && utxoBlock[EntityMetaKey.Selector].hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
											networkSlug: String(networkByCaip2[String(String(utxoBlock[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(utxoBlock[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											height: String(utxoBlock[EntityMetaKey.Selector].height ?? ''),
											hash: String(utxoBlock[EntityMetaKey.Selector].hash ?? ''),
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

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<UtxoTransactionsView
				selection={selection[EntityProxyField]<EntityType.UtxoTransaction>('$$transactions')}
				title='Transactions'
				id='UtxoTransactionsView-$$transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
