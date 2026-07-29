<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.HederaAccount_Timestamp> = $props()

	const hederaAccountTimestamp = $derived(selection({
		fields: {
			balanceTinybar: true,
		},
	}))
	const titleFallback = $derived(String(prefetched.balanceTinybar ?? '') || 'hedera account timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaAccountTimestamp}>
			{#snippet children(entity)}
				{@const balanceTinybar = entity.balanceTinybar}
				{#if balanceTinybar != null}
					<NumberValue
						value={balanceTinybar}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.source || String(prefetched.balanceTinybar ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={hederaAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceTinybar = entity.balanceTinybar}
					{#if balanceTinybar != null}
						<div>
							<dt>balance tinybar</dt>
							<dd>
								{balanceTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pendingRewardTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingRewardTinybar = entity.pendingRewardTinybar}
					{#if pendingRewardTinybar != null}
						<div>
							<dt>pending reward tinybar</dt>
							<dd>
								{pendingRewardTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakedAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakedAccountId = entity.stakedAccountId}
					{#if stakedAccountId != null}
						<div>
							<dt>staked account ID</dt>
							<dd>
								<TruncatedValue value={stakedAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakedNodeId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakedNodeId = entity.stakedNodeId}
					{#if stakedNodeId != null}
						<div>
							<dt>staked node ID</dt>
							<dd>
								{stakedNodeId}
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
							alias: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const alias = entity.alias}
					{#if alias != null}
						<div>
							<dt>alias</dt>
							<dd>
								{alias}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evmAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evmAddress = entity.evmAddress}
					{#if evmAddress != null}
						<div>
							<dt>EVM address</dt>
							<dd>
								<TruncatedValue value={evmAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							receiverSigRequired: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receiverSigRequired = entity.receiverSigRequired}
					{#if receiverSigRequired != null}
						<div>
							<dt>receiver sig required</dt>
							<dd>
								{receiverSigRequired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>memo</dt>
							<dd>
								{memo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
