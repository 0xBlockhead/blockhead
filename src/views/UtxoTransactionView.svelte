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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.UtxoTransaction>>
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

	const utxoTransaction = $derived(selection({
		fields: {
			feeSats: true,
			isCoinbase: true,
			version: true,
			lockTime: true,
			sizeBytes: true,
			virtualSizeBytes: true,
			weightUnits: true,
			$block: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).txId) ?? '')].filter(Boolean).join(' ') || 'UTXO transaction')
	const viewDomId = $derived('utxo-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
	import ZcashShieldedActionsView from '$/views/ZcashShieldedActionsView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			txId: String(({ ...selection.entitySelector, ...prefetched }).txId),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const txId0 = ({ ...selection.entitySelector, ...prefetched }).txId}
			{#if txId0 !== undefined && txId0 !== null}
				<TruncatedValue value={String(txId0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoTransaction}>
				{#snippet Pending()}
					{@const txId0 = ({ ...selection.entitySelector, ...prefetched }).txId}
					{#if txId0 !== undefined && txId0 !== null}
						<TruncatedValue value={String(txId0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const txId0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).txId}
					{#if txId0 !== undefined && txId0 !== null}
						<TruncatedValue value={String(txId0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const txId0 = ({ ...selection.entitySelector, ...prefetched }).txId}
			{#if txId0 !== undefined && txId0 !== null}
				<TruncatedValue value={String(txId0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoTransaction}>
				{#snippet Pending()}
					{@const txId0 = ({ ...selection.entitySelector, ...prefetched }).txId}
					{#if txId0 !== undefined && txId0 !== null}
						<TruncatedValue value={String(txId0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const txId0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).txId}
					{#if txId0 !== undefined && txId0 !== null}
						<TruncatedValue value={String(txId0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const feeSats0 = prefetched.feeSats}
			{#if feeSats0 !== undefined && feeSats0 !== null}
				<span data-text="muted">
					{String((feeSats0) ?? '')}
				</span>
			{/if}
			{@const isCoinbase1 = prefetched.isCoinbase}
			{#if isCoinbase1 !== undefined && isCoinbase1 !== null}
				<span data-text="muted">
					{String((isCoinbase1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={utxoTransaction}>
				{#snippet Pending()}
					{@const feeSats0 = prefetched.feeSats}
					{#if feeSats0 !== undefined && feeSats0 !== null}
						<span data-text="muted">
							{String((feeSats0) ?? '')}
						</span>
					{/if}
					{@const isCoinbase1 = prefetched.isCoinbase}
					{#if isCoinbase1 !== undefined && isCoinbase1 !== null}
						<span data-text="muted">
							{String((isCoinbase1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const feeSats0 = entity.feeSats}
					{#if feeSats0 !== undefined && feeSats0 !== null}
						<span data-text="muted">
							{String((feeSats0) ?? '')}
						</span>
					{/if}
					{@const isCoinbase1 = entity.isCoinbase}
					{#if isCoinbase1 !== undefined && isCoinbase1 !== null}
						<span data-text="muted">
							{String((isCoinbase1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={utxoTransaction}>
				{#snippet Pending()}
					{@const version = prefetched.version ?? selection.entitySelector.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const version = entity.version ?? selection.entitySelector.version ?? prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoTransaction}>
				{#snippet Pending()}
					{@const lockTime = prefetched.lockTime ?? selection.entitySelector.lockTime}
					{#if lockTime !== undefined && lockTime !== null}
						<div>
							<dt>Lock time</dt>
							<dd>
								{String((lockTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const lockTime = entity.lockTime ?? selection.entitySelector.lockTime ?? prefetched.lockTime}
					{#if lockTime !== undefined && lockTime !== null}
						<div>
							<dt>Lock time</dt>
							<dd>
								{String((lockTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={utxoTransaction}>
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

			<ResourceBoundary resource={utxoTransaction}>
				{#snippet Pending()}
					{@const virtualSizeBytes = prefetched.virtualSizeBytes ?? selection.entitySelector.virtualSizeBytes}
					{#if virtualSizeBytes !== undefined && virtualSizeBytes !== null}
						<div>
							<dt>Virtual size</dt>
							<dd>
								{String((virtualSizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const virtualSizeBytes = entity.virtualSizeBytes ?? selection.entitySelector.virtualSizeBytes ?? prefetched.virtualSizeBytes}
					{#if virtualSizeBytes !== undefined && virtualSizeBytes !== null}
						<div>
							<dt>Virtual size</dt>
							<dd>
								{String((virtualSizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoTransaction}>
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
				resource={selection[EntityProxyField]<EntityType.UtxoBlock, false>('$block')}
			>
				{#snippet children(utxoBlock)}
					{#if utxoBlock != null}
						<div>
							<dt>Block</dt>
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
			<UtxoInputsView
				selection={selection[EntityProxyField]<EntityType.UtxoInput>('$$inputs')}
				title='Inputs'
				id='UtxoInputsView-$$inputs'
			/>

			<UtxoOutputsView
				selection={selection[EntityProxyField]<EntityType.UtxoOutput>('$$outputs')}
				title='Outputs'
				id='UtxoOutputsView-$$outputs'
			/>

			<ZcashShieldedActionsView
				selection={selection[EntityProxyField]<EntityType.ZcashShieldedAction>('$$zcashShieldedActions')}
				title='Zcash shielded actions'
				id='ZcashShieldedActionsView-$$zcashShieldedActions'
			/>
		{/if}
	{/snippet}
</EntityView>
