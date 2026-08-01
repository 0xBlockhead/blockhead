<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadWalletConnection> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWalletConnection = $derived(viewSelection({
		fields: {
			status: true,
			protocol: true,
			transportKind: true,
			selected: true,
		},
	}))
	const titleFallback = 'wallet connection'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AccountsView from '$/views/AccountsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletConnection}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/accounts/connections/[connectionKey=stringSegment]',
				{
					connectionKey: selection.entitySelector.connectionKey,
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
		<ResourceBoundary
			resource={selection.$wallet}
		>
			{#snippet children(blockheadWallet)}
				<BlockheadWalletView
					selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
					prefetched={blockheadWallet}
					layout={EntityLayout.Title}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletConnection}>
			{#snippet children(entity)}
				{entity.status || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWalletConnection}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.status}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection key</dt>
				<dd>
					{selection.entitySelector.connectionKey}
				</dd>
			</div>

			<div>
				<dt>Wallet</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$wallet}
					>
						{#snippet children(blockheadWallet)}
							<BlockheadWalletView
								selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
								prefetched={blockheadWallet}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletConnection}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletConnection}
					>
						{#snippet children(entity)}
							{entity.protocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transport</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletConnection}
					>
						{#snippet children(entity)}
							{entity.transportKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Selected</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletConnection}
					>
						{#snippet children(entity)}
							{entity.selected ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							connectedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const connectedAt = entity.connectedAt}
					{#if connectedAt != null}
						<div>
							<dt>Connected</dt>
							<dd>
								<Timestamp timestamp={connectedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							disconnectedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const disconnectedAt = entity.disconnectedAt}
					{#if disconnectedAt != null}
						<div>
							<dt>Disconnected</dt>
							<dd>
								<Timestamp timestamp={disconnectedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sessionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sessionId = entity.sessionId}
					{#if sessionId != null}
						<div>
							<dt>Session ID</dt>
							<dd>
								{sessionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sessionTopic: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sessionTopic = entity.sessionTopic}
					{#if sessionTopic != null}
						<div>
							<dt>Session topic</dt>
							<dd>
								{sessionTopic}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$activeAccount}
			>
				{#snippet children(account)}
					{#if account != null}
						<div>
							<dt>Active account</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, account[EntityMetaKey.Selector])}
									prefetched={account}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const accountsResource = selection.$$accounts}
		<ResourceBoundary
			resource={accountsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AccountsView
						selection={accountsResource}
						countResource={accountsResource.count}
						title='Accounts'
						id='accounts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
