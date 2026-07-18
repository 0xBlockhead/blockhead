<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.HederaTokenCustomFee>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.HederaTokenCustomFee>>
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
	const hederaTokenCustomFee = $derived(selection({
		sources: selection.sources,
	}))
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={hederaTokenCustomFee}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>token timestamp</dt>
				<dd>
					<HederaToken_TimestampView
						selection={select(EntityType.HederaToken_Timestamp, selection.entitySelector.$tokenTimestamp, {})}
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
								sources: selection.sources,
								fields: {
									feeIndex: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									feeKind: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							collectorAccountId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							denominatingTokenId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							amount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							numerator: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							denominator: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							minimumAmount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							maximumAmount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							netOfTransfers: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							allCollectorsAreExempt: true,
						},
					})
				}
			>
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
				resource={selection.$collector}
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
				resource={selection.$denominatingToken}
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
