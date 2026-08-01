<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadActionReadinessCheck> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadActionReadinessCheck = $derived(viewSelection({
		fields: {
			checkKind: true,
			createdAt: true,
			capabilityKey: true,
		},
	}))
	const titleFallback = $derived((prefetched.checkKind ?? '') || 'blockhead action readiness check')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadActionReadinessCheck_TimestampsView from '$/views/BlockheadActionReadinessCheck_TimestampsView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadActionReadinessCheck}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadActionReadinessCheck}>
			{#snippet children(entity)}
				{entity.checkKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadActionReadinessCheck}>
			{#snippet children(entity)}
				{(entity.capabilityKey ?? '') || entity.checkKind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadActionReadinessCheck}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.createdAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>session action</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$sessionAction}
					>
						{#snippet children(blockheadSessionAction)}
							<BlockheadSessionActionView
								selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
								prefetched={blockheadSessionAction}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>check ID</dt>
				<dd>
					{selection.entitySelector.checkId}
				</dd>
			</div>

			<div>
				<dt>check kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadActionReadinessCheck}
					>
						{#snippet children(entity)}
							{entity.checkKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							networkCaip2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const networkCaip2 = entity.networkCaip2}
					{#if networkCaip2 != null}
						<div>
							<dt>network CAIP-2</dt>
							<dd>
								<TruncatedValue value={`${networkCaip2.namespace}:${networkCaip2.reference}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							accountCaip10: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountCaip10 = entity.accountCaip10}
					{#if accountCaip10 != null}
						<div>
							<dt>account CAIP-10</dt>
							<dd>
								<TruncatedValue value={`${accountCaip10.namespace}:${accountCaip10.reference}:${accountCaip10.accountAddress}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							assetCaip19: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetCaip19 = entity.assetCaip19}
					{#if assetCaip19 != null}
						<div>
							<dt>asset CAIP-19</dt>
							<dd>
								{assetCaip19}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							chainId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chainId = entity.chainId}
					{#if chainId != null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue
									value={chainId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							accountAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountAddress = entity.accountAddress}
					{#if accountAddress != null}
						<div>
							<dt>account address</dt>
							<dd>
								<TruncatedValue value={accountAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tokenAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenAddress = entity.tokenAddress}
					{#if tokenAddress != null}
						<div>
							<dt>token address</dt>
							<dd>
								<TruncatedValue value={tokenAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							spenderAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spenderAddress = entity.spenderAddress}
					{#if spenderAddress != null}
						<div>
							<dt>spender address</dt>
							<dd>
								<TruncatedValue value={spenderAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadActionReadinessCheck}
			>
				{#snippet children(entity)}
					{@const capabilityKey = entity.capabilityKey}
					{#if capabilityKey != null}
						<div>
							<dt>capability key</dt>
							<dd>
								{capabilityKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							requiredAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requiredAmount = entity.requiredAmount}
					{#if requiredAmount != null}
						<div>
							<dt>required amount</dt>
							<dd>
								<NumberValue
									value={requiredAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadActionReadinessCheck}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadActionReadinessCheck_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
