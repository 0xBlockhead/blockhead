<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTokenCustomFee>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaTokenCustomFee>>
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
	const hederaTokenCustomFee = $derived(selection({}))
	const titleFallback = $derived('hedera token custom fee')
	const viewDomId = $derived('hedera-token-custom-fee-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaToken_TimestampView from '$/views/HederaToken_TimestampView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTokenCustomFee}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaTokenCustomFee}>
			{#snippet Pending()}
				{title || 'hedera token custom fee'}
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
				<dt>token timestamp</dt>
				<dd>
					<HederaToken_TimestampView
						selection={select(EntityType.HederaToken_Timestamp, selection.entitySelector.$tokenTimestamp)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>fee index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									feeIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const feeIndex = selection.entitySelector.feeIndex ?? prefetched.feeIndex}
							{#if feeIndex !== undefined && feeIndex !== null}
								{String((feeIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feeIndex = resolvedEntity.feeIndex}
							{#if feeIndex !== undefined && feeIndex !== null}
								{String((feeIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>fee kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									feeKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const feeKind = prefetched.feeKind}
							{#if feeKind !== undefined && feeKind !== null}
								{String((feeKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feeKind = resolvedEntity.feeKind}
							{#if feeKind !== undefined && feeKind !== null}
								{String((feeKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							collectorAccountId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const collectorAccountId = prefetched.collectorAccountId}
					{#if collectorAccountId !== undefined && collectorAccountId !== null}
						<div>
							<dt>collector account ID</dt>
							<dd>
								<TruncatedValue value={String((collectorAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const collectorAccountId = resolvedEntity.collectorAccountId}
					{#if collectorAccountId !== undefined && collectorAccountId !== null}
						<div>
							<dt>collector account ID</dt>
							<dd>
								<TruncatedValue value={String((collectorAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denominatingTokenId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const denominatingTokenId = prefetched.denominatingTokenId}
					{#if denominatingTokenId !== undefined && denominatingTokenId !== null}
						<div>
							<dt>denominating token ID</dt>
							<dd>
								{String((denominatingTokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const denominatingTokenId = resolvedEntity.denominatingTokenId}
					{#if denominatingTokenId !== undefined && denominatingTokenId !== null}
						<div>
							<dt>denominating token ID</dt>
							<dd>
								{String((denominatingTokenId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amount = prefetched.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								{String((amount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								{String((amount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							numerator: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const numerator = prefetched.numerator}
					{#if numerator !== undefined && numerator !== null}
						<div>
							<dt>numerator</dt>
							<dd>
								{String((numerator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const numerator = resolvedEntity.numerator}
					{#if numerator !== undefined && numerator !== null}
						<div>
							<dt>numerator</dt>
							<dd>
								{String((numerator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denominator: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const denominator = prefetched.denominator}
					{#if denominator !== undefined && denominator !== null}
						<div>
							<dt>denominator</dt>
							<dd>
								{String((denominator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const denominator = resolvedEntity.denominator}
					{#if denominator !== undefined && denominator !== null}
						<div>
							<dt>denominator</dt>
							<dd>
								{String((denominator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minimumAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const minimumAmount = prefetched.minimumAmount}
					{#if minimumAmount !== undefined && minimumAmount !== null}
						<div>
							<dt>minimum amount</dt>
							<dd>
								{String((minimumAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minimumAmount = resolvedEntity.minimumAmount}
					{#if minimumAmount !== undefined && minimumAmount !== null}
						<div>
							<dt>minimum amount</dt>
							<dd>
								{String((minimumAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maximumAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maximumAmount = prefetched.maximumAmount}
					{#if maximumAmount !== undefined && maximumAmount !== null}
						<div>
							<dt>maximum amount</dt>
							<dd>
								{String((maximumAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maximumAmount = resolvedEntity.maximumAmount}
					{#if maximumAmount !== undefined && maximumAmount !== null}
						<div>
							<dt>maximum amount</dt>
							<dd>
								{String((maximumAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							netOfTransfers: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const netOfTransfers = prefetched.netOfTransfers}
					{#if netOfTransfers !== undefined && netOfTransfers !== null}
						<div>
							<dt>net of transfers</dt>
							<dd>
								{netOfTransfers ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const netOfTransfers = resolvedEntity.netOfTransfers}
					{#if netOfTransfers !== undefined && netOfTransfers !== null}
						<div>
							<dt>net of transfers</dt>
							<dd>
								{netOfTransfers ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allCollectorsAreExempt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const allCollectorsAreExempt = prefetched.allCollectorsAreExempt}
					{#if allCollectorsAreExempt !== undefined && allCollectorsAreExempt !== null}
						<div>
							<dt>all collectors are exempt</dt>
							<dd>
								{allCollectorsAreExempt ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allCollectorsAreExempt = resolvedEntity.allCollectorsAreExempt}
					{#if allCollectorsAreExempt !== undefined && allCollectorsAreExempt !== null}
						<div>
							<dt>all collectors are exempt</dt>
							<dd>
								{allCollectorsAreExempt ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.HederaAccount, false>('$collector')}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null && hederaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>collector</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, hederaAccount[EntityMetaKey.Selector])}
									prefetched={hederaAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.HederaToken, false>('$denominatingToken')}
			>
				{#snippet children(hederaToken)}
					{#if hederaToken != null && hederaToken[EntityMetaKey.Selector] != null}
						<div>
							<dt>denominating token</dt>
							<dd>
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
									prefetched={hederaToken}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
