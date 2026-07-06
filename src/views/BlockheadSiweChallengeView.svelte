<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSiweChallenge>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadSiweChallenge>>
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
	const blockheadSiweChallenge = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			domain: true,
			verified: true,
			issuedAt: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.domain) ?? '')].filter(Boolean).join(' ') || 'blockhead siwe challenge')
	const viewDomId = $derived('blockhead-siwe-challenge-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSiweChallenge}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSiweChallenge}>
			{#snippet Pending()}
				{[String((prefetched.domain) ?? '')].filter(Boolean).join(' ') || title || 'blockhead siwe challenge'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.domain) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSiweChallenge}>
			{#snippet Pending()}
				{[String((prefetched.verified) ?? '')].filter(Boolean).join(' ') || [String((prefetched.domain) ?? '')].filter(Boolean).join(' ') || title || 'blockhead siwe challenge'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.verified) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.domain) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSiweChallenge}>
			{#snippet Pending()}
				{@const issuedAt0 = prefetched.issuedAt}
				{#if issuedAt0 !== undefined && issuedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(issuedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const issuedAt0 = resolvedEntity.issuedAt}
				{#if issuedAt0 !== undefined && issuedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(issuedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = selection.entitySelector.id ?? prefetched.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$network')}
					>
						{#snippet children(evmNetwork)}
							{#if evmNetwork[EntityMetaKey.Selector] != null}
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
									href={
										(evmNetwork[EntityMetaKey.Selector].caip2 !== undefined && evmNetwork[EntityMetaKey.Selector].caip2.namespace !== undefined && evmNetwork[EntityMetaKey.Selector].caip2 !== undefined && evmNetwork[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(evmNetwork[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(evmNetwork[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>room</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.BlockheadRoom, false>('$room')}
					>
						{#snippet children(blockheadRoom)}
							{#if blockheadRoom[EntityMetaKey.Selector] != null}
								<BlockheadRoomView
									selection={select(EntityType.BlockheadRoom, blockheadRoom[EntityMetaKey.Selector])}
									prefetched={blockheadRoom}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>from peer ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									fromPeerId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fromPeerId = prefetched.fromPeerId}
							{#if fromPeerId !== undefined && fromPeerId !== null}
								{String((fromPeerId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fromPeerId = resolvedEntity.fromPeerId}
							{#if fromPeerId !== undefined && fromPeerId !== null}
								{String((fromPeerId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>to peer ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									toPeerId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const toPeerId = prefetched.toPeerId}
							{#if toPeerId !== undefined && toPeerId !== null}
								{String((toPeerId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const toPeerId = resolvedEntity.toPeerId}
							{#if toPeerId !== undefined && toPeerId !== null}
								{String((toPeerId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signer</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$signer')}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount[EntityMetaKey.Selector] != null}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const address = prefetched.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>verified</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									verified: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const verified = prefetched.verified}
							{#if verified !== undefined && verified !== null}
								{verified ? 'Yes' : 'No'}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const verified = resolvedEntity.verified}
							{#if verified !== undefined && verified !== null}
								{verified ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							scheme: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const scheme = prefetched.scheme}
					{#if scheme !== undefined && scheme !== null}
						<div>
							<dt>scheme</dt>
							<dd>
								{String((scheme) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scheme = resolvedEntity.scheme}
					{#if scheme !== undefined && scheme !== null}
						<div>
							<dt>scheme</dt>
							<dd>
								{String((scheme) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>domain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									domain: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const domain = prefetched.domain}
							{#if domain !== undefined && domain !== null}
								{String((domain) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const domain = resolvedEntity.domain}
							{#if domain !== undefined && domain !== null}
								{String((domain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>URI</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									uri: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const uri = prefetched.uri}
							{#if uri !== undefined && uri !== null}
								<svelte:element
									this={'a'}
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const uri = resolvedEntity.uri}
							{#if uri !== undefined && uri !== null}
								<svelte:element
									this={'a'}
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									version: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const version = prefetched.version}
							{#if version !== undefined && version !== null}
								{String((version) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const version = resolvedEntity.version}
							{#if version !== undefined && version !== null}
								{String((version) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Chain ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									chainId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const chainId = prefetched.chainId}
							{#if chainId !== undefined && chainId !== null}
								{String((chainId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const chainId = resolvedEntity.chainId}
							{#if chainId !== undefined && chainId !== null}
								{String((chainId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>nonce</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nonce: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const nonce = prefetched.nonce}
							{#if nonce !== undefined && nonce !== null}
								{String((nonce) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nonce = resolvedEntity.nonce}
							{#if nonce !== undefined && nonce !== null}
								{String((nonce) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							statement: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const statement = prefetched.statement}
					{#if statement !== undefined && statement !== null}
						<div>
							<dt>statement</dt>
							<dd>
								{String((statement) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const statement = resolvedEntity.statement}
					{#if statement !== undefined && statement !== null}
						<div>
							<dt>statement</dt>
							<dd>
								{String((statement) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestId = prefetched.requestId}
					{#if requestId !== undefined && requestId !== null}
						<div>
							<dt>request ID</dt>
							<dd>
								{String((requestId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestId = resolvedEntity.requestId}
					{#if requestId !== undefined && requestId !== null}
						<div>
							<dt>request ID</dt>
							<dd>
								{String((requestId) ?? '')}
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
							selection({
								fields: {
									resources: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const resources = prefetched.resources}
							{#if resources !== undefined && resources !== null}
								{(resources?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const resources = resolvedEntity.resources}
							{#if resources !== undefined && resources !== null}
								{(resources?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestOrigin: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestOrigin = prefetched.requestOrigin}
					{#if requestOrigin !== undefined && requestOrigin !== null}
						<div>
							<dt>request origin</dt>
							<dd>
								{String((requestOrigin) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestOrigin = resolvedEntity.requestOrigin}
					{#if requestOrigin !== undefined && requestOrigin !== null}
						<div>
							<dt>request origin</dt>
							<dd>
								{String((requestOrigin) ?? '')}
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
							signature: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signature = prefetched.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signature = resolvedEntity.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signatureKind = prefetched.signatureKind}
					{#if signatureKind !== undefined && signatureKind !== null}
						<div>
							<dt>signature kind</dt>
							<dd>
								<TruncatedValue value={String((signatureKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signatureKind = resolvedEntity.signatureKind}
					{#if signatureKind !== undefined && signatureKind !== null}
						<div>
							<dt>signature kind</dt>
							<dd>
								<TruncatedValue value={String((signatureKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verificationMethod: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verificationMethod = prefetched.verificationMethod}
					{#if verificationMethod !== undefined && verificationMethod !== null}
						<div>
							<dt>verification method</dt>
							<dd>
								{String((verificationMethod) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verificationMethod = resolvedEntity.verificationMethod}
					{#if verificationMethod !== undefined && verificationMethod !== null}
						<div>
							<dt>verification method</dt>
							<dd>
								{String((verificationMethod) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verificationError: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verificationError = prefetched.verificationError}
					{#if verificationError !== undefined && verificationError !== null}
						<div>
							<dt>verification error</dt>
							<dd>
								{String((verificationError) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verificationError = resolvedEntity.verificationError}
					{#if verificationError !== undefined && verificationError !== null}
						<div>
							<dt>verification error</dt>
							<dd>
								{String((verificationError) ?? '')}
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
						resource={
							selection({
								fields: {
									issuedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const issuedAt = prefetched.issuedAt}
							{#if issuedAt !== undefined && issuedAt !== null}
								<Timestamp timestamp={Number(issuedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const issuedAt = resolvedEntity.issuedAt}
							{#if issuedAt !== undefined && issuedAt !== null}
								<Timestamp timestamp={Number(issuedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expiresAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expiresAt = prefetched.expiresAt}
					{#if expiresAt !== undefined && expiresAt !== null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={Number(expiresAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiresAt = resolvedEntity.expiresAt}
					{#if expiresAt !== undefined && expiresAt !== null}
						<div>
							<dt>expires AT</dt>
							<dd>
								<Timestamp timestamp={Number(expiresAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							notBefore: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const notBefore = prefetched.notBefore}
					{#if notBefore !== undefined && notBefore !== null}
						<div>
							<dt>not before</dt>
							<dd>
								<Timestamp timestamp={Number(notBefore)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const notBefore = resolvedEntity.notBefore}
					{#if notBefore !== undefined && notBefore !== null}
						<div>
							<dt>not before</dt>
							<dd>
								<Timestamp timestamp={Number(notBefore)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedAt = prefetched.verifiedAt}
					{#if verifiedAt !== undefined && verifiedAt !== null}
						<div>
							<dt>verified AT</dt>
							<dd>
								<Timestamp timestamp={Number(verifiedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedAt = resolvedEntity.verifiedAt}
					{#if verifiedAt !== undefined && verifiedAt !== null}
						<div>
							<dt>verified AT</dt>
							<dd>
								<Timestamp timestamp={Number(verifiedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
