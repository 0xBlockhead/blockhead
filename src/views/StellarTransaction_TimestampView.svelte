<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarTransaction_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StellarTransaction_Timestamp>>
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
	const stellarTransactionTimestamp = $derived(selection({}))
	const titleFallback = $derived('stellar transaction timestamp')
	const viewDomId = $derived('stellar-transaction-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarTransaction_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={stellarTransactionTimestamp}>
			{#snippet Pending()}
				{title || 'stellar transaction timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<StellarTransactionView
						selection={select(EntityType.StellarTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerSequence: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerSequence = prefetched.ledgerSequence}
					{#if ledgerSequence !== undefined && ledgerSequence !== null}
						<div>
							<dt>ledger sequence</dt>
							<dd>
								{String((ledgerSequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerSequence = resolvedEntity.ledgerSequence}
					{#if ledgerSequence !== undefined && ledgerSequence !== null}
						<div>
							<dt>ledger sequence</dt>
							<dd>
								{String((ledgerSequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							successful: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const successful = prefetched.successful}
					{#if successful !== undefined && successful !== null}
						<div>
							<dt>successful</dt>
							<dd>
								{successful ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const successful = resolvedEntity.successful}
					{#if successful !== undefined && successful !== null}
						<div>
							<dt>successful</dt>
							<dd>
								{successful ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resultCode = prefetched.resultCode}
					{#if resultCode !== undefined && resultCode !== null}
						<div>
							<dt>result code</dt>
							<dd>
								{String((resultCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resultCode = resolvedEntity.resultCode}
					{#if resultCode !== undefined && resultCode !== null}
						<div>
							<dt>result code</dt>
							<dd>
								{String((resultCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeCharged: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeCharged = prefetched.feeCharged}
					{#if feeCharged !== undefined && feeCharged !== null}
						<div>
							<dt>fee charged</dt>
							<dd>
								{String((feeCharged) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeCharged = resolvedEntity.feeCharged}
					{#if feeCharged !== undefined && feeCharged !== null}
						<div>
							<dt>fee charged</dt>
							<dd>
								{String((feeCharged) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxFee: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxFee = prefetched.maxFee}
					{#if maxFee !== undefined && maxFee !== null}
						<div>
							<dt>max fee</dt>
							<dd>
								{String((maxFee) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxFee = resolvedEntity.maxFee}
					{#if maxFee !== undefined && maxFee !== null}
						<div>
							<dt>max fee</dt>
							<dd>
								{String((maxFee) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							envelopeXdr: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const envelopeXdr = prefetched.envelopeXdr}
					{#if envelopeXdr !== undefined && envelopeXdr !== null}
						<div>
							<dt>envelope xdr</dt>
							<dd>
								{String((envelopeXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const envelopeXdr = resolvedEntity.envelopeXdr}
					{#if envelopeXdr !== undefined && envelopeXdr !== null}
						<div>
							<dt>envelope xdr</dt>
							<dd>
								{String((envelopeXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultXdr: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resultXdr = prefetched.resultXdr}
					{#if resultXdr !== undefined && resultXdr !== null}
						<div>
							<dt>result xdr</dt>
							<dd>
								{String((resultXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resultXdr = resolvedEntity.resultXdr}
					{#if resultXdr !== undefined && resultXdr !== null}
						<div>
							<dt>result xdr</dt>
							<dd>
								{String((resultXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metaXdr: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metaXdr = prefetched.metaXdr}
					{#if metaXdr !== undefined && metaXdr !== null}
						<div>
							<dt>meta xdr</dt>
							<dd>
								{String((metaXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metaXdr = resolvedEntity.metaXdr}
					{#if metaXdr !== undefined && metaXdr !== null}
						<div>
							<dt>meta xdr</dt>
							<dd>
								{String((metaXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeMetaXdr: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeMetaXdr = prefetched.feeMetaXdr}
					{#if feeMetaXdr !== undefined && feeMetaXdr !== null}
						<div>
							<dt>fee meta xdr</dt>
							<dd>
								{String((feeMetaXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeMetaXdr = resolvedEntity.feeMetaXdr}
					{#if feeMetaXdr !== undefined && feeMetaXdr !== null}
						<div>
							<dt>fee meta xdr</dt>
							<dd>
								{String((feeMetaXdr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>signatures</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signatures: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signatures = prefetched.signatures}
							{#if signatures !== undefined && signatures !== null}
								<TruncatedValue value={(signatures?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signatures = resolvedEntity.signatures}
							{#if signatures !== undefined && signatures !== null}
								<TruncatedValue value={(signatures?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
