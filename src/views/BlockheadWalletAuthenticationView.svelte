<!-- Generated from APP.ts. -->

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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadWalletAuthentication>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWalletAuthentication = $derived(viewSelection({
		fields: {
			protocol: true,
			verified: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.authenticationId || 'blockhead wallet authentication')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletAuthentication}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/wallet/authentication/[authenticationId=stringSegment]',
				{
					authenticationId: selection.entitySelector.authenticationId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletAuthentication}>
			{#snippet children(entity)}
				{[entity.protocol, String(entity.verified)].filter(Boolean).join(' ') || selection.entitySelector.authenticationId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>authentication ID</dt>
				<dd>
					{selection.entitySelector.authenticationId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$connection}
			>
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null}
						<div>
							<dt>connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(account)}
					{#if account != null}
						<div>
							<dt>account</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, account[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>protocol</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletAuthentication}
					>
						{#snippet children(entity)}
							{entity.protocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>verified</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletAuthentication}
					>
						{#snippet children(entity)}
							{entity.verified ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							<dt>error</dt>
							<dd>
								{error}
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
							statement: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const statement = entity.statement}
					{#if statement != null}
						<div>
							<dt>statement</dt>
							<dd>
								{statement}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							domain: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const domain = entity.domain}
					{#if domain != null}
						<div>
							<dt>domain</dt>
							<dd>
								{domain}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							uri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uri = entity.uri}
					{#if uri != null}
						<div>
							<dt>URI</dt>
							<dd>
								<a
									href={uri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={uri} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>nonce</dt>
							<dd>
								{nonce}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
								{chainId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signature = entity.signature}
					{#if signature != null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={signature} />
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
							issuedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const issuedAt = entity.issuedAt}
					{#if issuedAt != null}
						<div>
							<dt>issued AT</dt>
							<dd>
								<Timestamp timestamp={issuedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expirationTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirationTime = entity.expirationTime}
					{#if expirationTime != null}
						<div>
							<dt>expiration time</dt>
							<dd>
								<Timestamp timestamp={expirationTime} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							notBefore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const notBefore = entity.notBefore}
					{#if notBefore != null}
						<div>
							<dt>not before</dt>
							<dd>
								<Timestamp timestamp={notBefore} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verifiedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedAt = entity.verifiedAt}
					{#if verifiedAt != null}
						<div>
							<dt>verified AT</dt>
							<dd>
								<Timestamp timestamp={verifiedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
