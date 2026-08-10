<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadWalletConnection>, 'prefetched'> = $props()

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
		},
	}))
	const titleFallback = 'wallet connection'


	// Components
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
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
				'/~/wallets/connections/[connectionKey=stringSegment]',
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
	{#snippet Icon()}
		<IconComponent />
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={selection.$wallet}
		>
			{#snippet children(blockheadWallet)}
				{@const blockheadWalletInitial = untrack(() => blockheadWallet)}
				<BlockheadWalletView
					selection={select(EntityType.BlockheadWallet, (blockheadWallet ?? blockheadWalletInitial)[EntityMetaKey.Selector])}
					prefetched={blockheadWallet ?? blockheadWalletInitial}
					href={null}
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

	{#snippet Content()}
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
							{@const blockheadWalletInitial = untrack(() => blockheadWallet)}
							<BlockheadWalletView
								selection={select(EntityType.BlockheadWallet, (blockheadWallet ?? blockheadWalletInitial)[EntityMetaKey.Selector])}
								prefetched={blockheadWallet ?? blockheadWalletInitial}
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
						{@const accountInitial = untrack(() => account)}
						<div>
							<dt>Active account</dt>
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
		</dl>

		<ProjectionBoundary
			resource={selection.Connected}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<div>
						<dt>Selected</dt>
						<dd>
							<ResourceBoundary
								resource={projection.selected}
							>
								{#snippet children(selected)}
									{selected ? 'Yes' : 'No'}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}

	{#snippet Details()}
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
