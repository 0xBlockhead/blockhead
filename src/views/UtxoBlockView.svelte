<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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

	const utxoBlock = $derived(selection({
		fields: {
			transactionCount: true,
			timestampMs: true,
			merkleRoot: true,
			nonce: true,
			difficulty: true,
			sizeBytes: true,
			weightUnits: true,
			$parent: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).height) ?? '') ? 'Block #' + String((({ ...selection.entitySelector, ...prefetched }).height) ?? '') : '') || [String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block')
	const viewDomId = $derived('utxo-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).height ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			height: String(({ ...selection.entitySelector, ...prefetched }).height),
			hash: String(({ ...selection.entitySelector, ...prefetched }).hash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).height}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Block </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{:else}
			{[String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).height}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{:else}
			{[String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const transactionCount0 = prefetched.transactionCount}
			{#if transactionCount0 !== undefined && transactionCount0 !== null}
				<span data-text="muted">
					{String((transactionCount0) ?? '')}
				</span>
			{/if}
		{:else}
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
					{@const transactionCount0 = entity.transactionCount}
					{#if transactionCount0 !== undefined && transactionCount0 !== null}
						<span data-text="muted">
							{String((transactionCount0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary resource={utxoBlock}>
						{#snippet Pending()}
							{@const height = prefetched.height ?? selection.entitySelector.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const height = entity.height ?? selection.entitySelector.height ?? prefetched.height}
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
					<ResourceBoundary resource={utxoBlock}>
						{#snippet Pending()}
							{@const hash = prefetched.hash ?? selection.entitySelector.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String(hash)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const hash = entity.hash ?? selection.entitySelector.hash ?? prefetched.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String(hash)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={utxoBlock}>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
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
					{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={utxoBlock}>
				{#snippet Pending()}
					{@const merkleRoot = prefetched.merkleRoot ?? selection.entitySelector.merkleRoot}
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
					{@const merkleRoot = entity.merkleRoot ?? selection.entitySelector.merkleRoot ?? prefetched.merkleRoot}
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

			<ResourceBoundary resource={utxoBlock}>
				{#snippet Pending()}
					{@const nonce = prefetched.nonce ?? selection.entitySelector.nonce}
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
					{@const nonce = entity.nonce ?? selection.entitySelector.nonce ?? prefetched.nonce}
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

			<ResourceBoundary resource={utxoBlock}>
				{#snippet Pending()}
					{@const difficulty = prefetched.difficulty ?? selection.entitySelector.difficulty}
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
					{@const difficulty = entity.difficulty ?? selection.entitySelector.difficulty ?? prefetched.difficulty}
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

			<ResourceBoundary resource={utxoBlock}>
				{#snippet Pending()}
					{@const sizeBytes = prefetched.sizeBytes ?? selection.entitySelector.sizeBytes}
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
					{@const sizeBytes = entity.sizeBytes ?? selection.entitySelector.sizeBytes ?? prefetched.sizeBytes}
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

			<ResourceBoundary resource={utxoBlock}>
				{#snippet Pending()}
					{@const weightUnits = prefetched.weightUnits ?? selection.entitySelector.weightUnits}
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
					{@const weightUnits = entity.weightUnits ?? selection.entitySelector.weightUnits ?? prefetched.weightUnits}
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
					{#if utxoBlock != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<UtxoBlockView
									selection={select(EntityType.UtxoBlock, utxoBlock.entitySelector)}
									prefetched={utxoBlock}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
											networkSlug: String(utxoBlock.entitySelector.$network.slug),
											height: String(utxoBlock.entitySelector.height),
											hash: String(utxoBlock.entitySelector.hash),
										})
									}
									layout={EntityLayout.Title}
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
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
