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
	}: EntitySelectionViewProps<EntityType.BlockheadSiweChallenge> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadSiweChallenge = $derived(viewSelection({
		fields: {
			domain: true,
			verified: true,
			issuedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.domain ?? '') || 'blockhead siwe challenge')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSiweChallenge}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSiweChallenge}>
			{#snippet children(entity)}
				{entity.domain || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSiweChallenge}>
			{#snippet children(entity)}
				{String(entity.verified)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSiweChallenge}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.issuedAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>room</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$room}
					>
						{#snippet children(blockheadRoom)}
							<BlockheadRoomView
								selection={select(EntityType.BlockheadRoom, blockheadRoom[EntityMetaKey.Selector])}
								prefetched={blockheadRoom}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>from peer ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									fromPeerId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.fromPeerId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>to peer ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									toPeerId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.toPeerId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signer</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$signer}
					>
						{#snippet children(evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
								prefetched={evmAccount}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.address} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>verified</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSiweChallenge}
					>
						{#snippet children(entity)}
							{entity.verified ? 'Yes' : 'No'}
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
							scheme: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const scheme = entity.scheme}
					{#if scheme != null}
						<div>
							<dt>scheme</dt>
							<dd>
								{scheme}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>domain</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSiweChallenge}
					>
						{#snippet children(entity)}
							{entity.domain}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>URI</dt>
				<dd>
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
							<a
								href={entity.uri}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.uri} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									version: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.version}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Chain ID</dt>
				<dd>
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
							{entity.chainId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>nonce</dt>
				<dd>
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
							{entity.nonce}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							requestId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestId = entity.requestId}
					{#if requestId != null}
						<div>
							<dt>request ID</dt>
							<dd>
								{requestId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>resources</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									resources: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.resources.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							requestOrigin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestOrigin = entity.requestOrigin}
					{#if requestOrigin != null}
						<div>
							<dt>request origin</dt>
							<dd>
								{requestOrigin}
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signatureKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureKind = entity.signatureKind}
					{#if signatureKind != null}
						<div>
							<dt>signature kind</dt>
							<dd>
								{signatureKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verificationMethod: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verificationMethod = entity.verificationMethod}
					{#if verificationMethod != null}
						<div>
							<dt>verification method</dt>
							<dd>
								{verificationMethod}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verificationError: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verificationError = entity.verificationError}
					{#if verificationError != null}
						<div>
							<dt>verification error</dt>
							<dd>
								{verificationError}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>issued AT</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSiweChallenge}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.issuedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expiresAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiresAt = entity.expiresAt}
					{#if expiresAt != null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={expiresAt} />
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
