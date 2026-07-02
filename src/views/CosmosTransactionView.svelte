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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosTransaction>>
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

	const cosmosTransaction = $derived(selection({
		fields: {
			code: true,
			gasUsed: true,
			codespace: true,
			gasWanted: true,
			feeAmount: true,
			feeGasLimit: true,
			memo: true,
			timeoutHeight: true,
			signerAddresses: true,
			signatures: true,
			eventTypes: true,
			$block: true,
			rawLog: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).txHash) ?? '')].filter(Boolean).join(' ') || 'Cosmos transaction')
	const viewDomId = $derived('cosmos-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosMessagesView from '$/views/CosmosMessagesView.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			txHash: String(({ ...selection.entitySelector, ...prefetched }).txHash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const txHash0 = ({ ...selection.entitySelector, ...prefetched }).txHash}
			{#if txHash0 !== undefined && txHash0 !== null}
				<TruncatedValue value={String(txHash0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosTransaction}>
				{#snippet Pending()}
					{@const txHash0 = ({ ...selection.entitySelector, ...prefetched }).txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String(txHash0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const txHash0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String(txHash0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const txHash0 = ({ ...selection.entitySelector, ...prefetched }).txHash}
			{#if txHash0 !== undefined && txHash0 !== null}
				<TruncatedValue value={String(txHash0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosTransaction}>
				{#snippet Pending()}
					{@const txHash0 = ({ ...selection.entitySelector, ...prefetched }).txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String(txHash0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const txHash0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String(txHash0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const code0 = prefetched.code}
			{#if code0 !== undefined && code0 !== null}
				<span data-text="muted">
					{String((code0) ?? '')}
				</span>
			{/if}
			{@const gasUsed1 = prefetched.gasUsed}
			{#if gasUsed1 !== undefined && gasUsed1 !== null}
				<span data-text="muted">
					{String((gasUsed1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosTransaction}>
				{#snippet Pending()}
					{@const code0 = prefetched.code}
					{#if code0 !== undefined && code0 !== null}
						<span data-text="muted">
							{String((code0) ?? '')}
						</span>
					{/if}
					{@const gasUsed1 = prefetched.gasUsed}
					{#if gasUsed1 !== undefined && gasUsed1 !== null}
						<span data-text="muted">
							{String((gasUsed1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const code0 = entity.code}
					{#if code0 !== undefined && code0 !== null}
						<span data-text="muted">
							{String((code0) ?? '')}
						</span>
					{/if}
					{@const gasUsed1 = entity.gasUsed}
					{#if gasUsed1 !== undefined && gasUsed1 !== null}
						<span data-text="muted">
							{String((gasUsed1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosTransaction}>
				{#snippet Pending()}
					{@const codespace = prefetched.codespace ?? selection.entitySelector.codespace}
					{#if codespace !== undefined && codespace !== null}
						<div>
							<dt>Codespace</dt>
							<dd>
								{String((codespace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const codespace = entity.codespace ?? selection.entitySelector.codespace ?? prefetched.codespace}
					{#if codespace !== undefined && codespace !== null}
						<div>
							<dt>Codespace</dt>
							<dd>
								{String((codespace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosTransaction}>
				{#snippet Pending()}
					{@const gasWanted = prefetched.gasWanted ?? selection.entitySelector.gasWanted}
					{#if gasWanted !== undefined && gasWanted !== null}
						<div>
							<dt>Gas wanted</dt>
							<dd>
								{String((gasWanted) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const gasWanted = entity.gasWanted ?? selection.entitySelector.gasWanted ?? prefetched.gasWanted}
					{#if gasWanted !== undefined && gasWanted !== null}
						<div>
							<dt>Gas wanted</dt>
							<dd>
								{String((gasWanted) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Fee amount</dt>
				<dd>
					<ResourceBoundary resource={cosmosTransaction}>
						{#snippet Pending()}
							{@const feeAmount = prefetched.feeAmount ?? selection.entitySelector.feeAmount}
							{#if feeAmount !== undefined && feeAmount !== null}
								{feeAmount.map((value) => String((`${value.amount} ${value.denom}`) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const feeAmount = entity.feeAmount ?? selection.entitySelector.feeAmount ?? prefetched.feeAmount}
							{#if feeAmount !== undefined && feeAmount !== null}
								{feeAmount.map((value) => String((`${value.amount} ${value.denom}`) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={cosmosTransaction}>
				{#snippet Pending()}
					{@const feeGasLimit = prefetched.feeGasLimit ?? selection.entitySelector.feeGasLimit}
					{#if feeGasLimit !== undefined && feeGasLimit !== null}
						<div>
							<dt>Fee gas limit</dt>
							<dd>
								{String((feeGasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const feeGasLimit = entity.feeGasLimit ?? selection.entitySelector.feeGasLimit ?? prefetched.feeGasLimit}
					{#if feeGasLimit !== undefined && feeGasLimit !== null}
						<div>
							<dt>Fee gas limit</dt>
							<dd>
								{String((feeGasLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosTransaction}>
				{#snippet Pending()}
					{@const memo = prefetched.memo ?? selection.entitySelector.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>Memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const memo = entity.memo ?? selection.entitySelector.memo ?? prefetched.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>Memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosTransaction}>
				{#snippet Pending()}
					{@const timeoutHeight = prefetched.timeoutHeight ?? selection.entitySelector.timeoutHeight}
					{#if timeoutHeight !== undefined && timeoutHeight !== null}
						<div>
							<dt>Timeout height</dt>
							<dd>
								{String((timeoutHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timeoutHeight = entity.timeoutHeight ?? selection.entitySelector.timeoutHeight ?? prefetched.timeoutHeight}
					{#if timeoutHeight !== undefined && timeoutHeight !== null}
						<div>
							<dt>Timeout height</dt>
							<dd>
								{String((timeoutHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Signer addresses</dt>
				<dd>
					<ResourceBoundary resource={cosmosTransaction}>
						{#snippet Pending()}
							{@const signerAddresses = prefetched.signerAddresses ?? selection.entitySelector.signerAddresses}
							{#if signerAddresses !== undefined && signerAddresses !== null}
								{String((signerAddresses) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const signerAddresses = entity.signerAddresses ?? selection.entitySelector.signerAddresses ?? prefetched.signerAddresses}
							{#if signerAddresses !== undefined && signerAddresses !== null}
								{String((signerAddresses) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Signatures</dt>
				<dd>
					<ResourceBoundary resource={cosmosTransaction}>
						{#snippet Pending()}
							{@const signatures = prefetched.signatures ?? selection.entitySelector.signatures}
							{#if signatures !== undefined && signatures !== null}
								{String((signatures) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const signatures = entity.signatures ?? selection.entitySelector.signatures ?? prefetched.signatures}
							{#if signatures !== undefined && signatures !== null}
								{String((signatures) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Event types</dt>
				<dd>
					<ResourceBoundary resource={cosmosTransaction}>
						{#snippet Pending()}
							{@const eventTypes = prefetched.eventTypes ?? selection.entitySelector.eventTypes}
							{#if eventTypes !== undefined && eventTypes !== null}
								{String((eventTypes) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const eventTypes = entity.eventTypes ?? selection.entitySelector.eventTypes ?? prefetched.eventTypes}
							{#if eventTypes !== undefined && eventTypes !== null}
								{String((eventTypes) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CosmosBlock, false>('$block')}
			>
				{#snippet children(cosmosBlock)}
					{#if cosmosBlock != null}
						<div>
							<dt>Block</dt>
							<dd>
								<CosmosBlockView
									selection={select(EntityType.CosmosBlock, cosmosBlock.entitySelector)}
									prefetched={cosmosBlock}
									href={
										resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]', {
											caip2: `${String(cosmosBlock.entitySelector.$network.caip2.namespace)}:${String(cosmosBlock.entitySelector.$network.caip2.reference)}`,
											height: String(cosmosBlock.entitySelector.height),
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

		<ResourceBoundary resource={cosmosTransaction}>
			{#snippet children(entity)}
				{@const rawLog = entity.rawLog ?? selection.entitySelector.rawLog ?? prefetched.rawLog}
				{#if rawLog === undefined || rawLog === null || rawLog === ''}
					<p data-text="muted">No raw log available.</p>
				{:else}
					<code>{String((rawLog) ?? '')}</code>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CosmosMessagesView
				selection={selection[EntityProxyField]<EntityType.CosmosMessage>('$$messages')}
				title='Messages'
				emptyText='No Cosmos messages.'
				id='CosmosMessagesView-$$messages'
			/>
		{/if}
	{/snippet}
</EntityView>
