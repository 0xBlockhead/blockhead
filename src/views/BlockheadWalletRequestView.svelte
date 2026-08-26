<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadWalletRequest> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWalletRequest = $derived(viewSelection({
		fields: {
			requestKind: true,
			requestMethod: true,
			requestedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.requestKind ?? '') || 'blockhead wallet request')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletRequest_TimestampsView from '$/views/BlockheadWalletRequest_TimestampsView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
	import BlockheadIntentOrderView from '$/views/BlockheadIntentOrderView.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import AccountView from '$/views/AccountView.svelte'
	import BlockheadEvmWalletRequestView from '$/views/BlockheadEvmWalletRequestView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletRequest}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/wallets/requests/[id=stringSegment]',
				{
					id: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet children(entity)}
				{entity.requestKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet children(entity)}
				{entity.requestMethod || entity.requestKind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWalletRequest}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.requestedAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$sessionAction}
			>
				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null}
						{@const blockheadSessionActionInitial = untrack(() => blockheadSessionAction)}
						<div>
							<dt>session action</dt>
							<dd>
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, (blockheadSessionAction ?? blockheadSessionActionInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction ?? blockheadSessionActionInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$intentOrder}
			>
				{#snippet children(blockheadIntentOrder)}
					{#if blockheadIntentOrder != null}
						{@const blockheadIntentOrderInitial = untrack(() => blockheadIntentOrder)}
						<div>
							<dt>intent order</dt>
							<dd>
								<BlockheadIntentOrderView
									selection={select(EntityType.BlockheadIntentOrder, (blockheadIntentOrder ?? blockheadIntentOrderInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadIntentOrder ?? blockheadIntentOrderInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>wallet connection</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$walletConnection}
					>
						{#snippet children(blockheadWalletConnection)}
							{@const blockheadWalletConnectionInitial = untrack(() => blockheadWalletConnection)}
							<BlockheadWalletConnectionView
								selection={select(EntityType.BlockheadWalletConnection, (blockheadWalletConnection ?? blockheadWalletConnectionInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(account)}
					{#if account != null}
						{@const accountInitial = untrack(() => account)}
						<div>
							<dt>Account</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, (account ?? accountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$evmRequest}
			>
				{#snippet children(blockheadEvmWalletRequest)}
					{#if blockheadEvmWalletRequest != null}
						{@const blockheadEvmWalletRequestInitial = untrack(() => blockheadEvmWalletRequest)}
						<div>
							<dt>EVM request</dt>
							<dd>
								<BlockheadEvmWalletRequestView
									selection={select(EntityType.BlockheadEvmWalletRequest, (blockheadEvmWalletRequest ?? blockheadEvmWalletRequestInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
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
							atomicRequired: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const atomicRequired = entity.atomicRequired}
					{#if atomicRequired != null}
						<div>
							<dt>atomic required</dt>
							<dd>
								{atomicRequired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>request payload hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									requestPayloadHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.requestPayloadHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							submittedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const submittedAt = entity.submittedAt}
					{#if submittedAt != null}
						<div>
							<dt>submitted at</dt>
							<dd>
								<Timestamp timestamp={submittedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadWalletRequest_TimestampsView
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
