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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletTransportSession>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadWalletTransportSession>>
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
	const blockheadWalletTransportSession = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			transportKind: true,
			sessionKind: true,
			status: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.transportSessionId ?? prefetched.transportSessionId) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet transport session')
	const viewDomId = $derived('blockhead-wallet-transport-session-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletTransportSession}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWalletTransportSession}>
			{#snippet Pending()}
				{[String((selection.entitySelector.transportSessionId ?? prefetched.transportSessionId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet transport session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transportSessionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletTransportSession}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? ''), String((prefetched.transportKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.transportSessionId ?? prefetched.transportSessionId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead wallet transport session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.transportKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.transportSessionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									connectionKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const connectionKey = selection.entitySelector.connectionKey ?? prefetched.connectionKey}
							{#if connectionKey !== undefined && connectionKey !== null}
								{String((connectionKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionKey = resolvedEntity.connectionKey}
							{#if connectionKey !== undefined && connectionKey !== null}
								{String((connectionKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transport session ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transportSessionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transportSessionId = selection.entitySelector.transportSessionId ?? prefetched.transportSessionId}
							{#if transportSessionId !== undefined && transportSessionId !== null}
								{String((transportSessionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transportSessionId = resolvedEntity.transportSessionId}
							{#if transportSessionId !== undefined && transportSessionId !== null}
								{String((transportSessionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadWalletConnection, false>('$connection')}
			>
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null && blockheadWalletConnection[EntityMetaKey.Selector] != null}
						<div>
							<dt>connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector])}
									prefetched={blockheadWalletConnection}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>transport kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transportKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transportKind = prefetched.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transportKind = resolvedEntity.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>session kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sessionKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sessionKind = prefetched.sessionKind}
							{#if sessionKind !== undefined && sessionKind !== null}
								{String((sessionKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sessionKind = resolvedEntity.sessionKind}
							{#if sessionKind !== undefined && sessionKind !== null}
								{String((sessionKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const status = prefetched.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
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
							topic: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const topic = prefetched.topic}
					{#if topic !== undefined && topic !== null}
						<div>
							<dt>topic</dt>
							<dd>
								{String((topic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const topic = resolvedEntity.topic}
					{#if topic !== undefined && topic !== null}
						<div>
							<dt>topic</dt>
							<dd>
								{String((topic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							peerId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const peerId = prefetched.peerId}
					{#if peerId !== undefined && peerId !== null}
						<div>
							<dt>peer ID</dt>
							<dd>
								{String((peerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerId = resolvedEntity.peerId}
					{#if peerId !== undefined && peerId !== null}
						<div>
							<dt>peer ID</dt>
							<dd>
								{String((peerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							relayProtocol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const relayProtocol = prefetched.relayProtocol}
					{#if relayProtocol !== undefined && relayProtocol !== null}
						<div>
							<dt>relay protocol</dt>
							<dd>
								{String((relayProtocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relayProtocol = resolvedEntity.relayProtocol}
					{#if relayProtocol !== undefined && relayProtocol !== null}
						<div>
							<dt>relay protocol</dt>
							<dd>
								{String((relayProtocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bridgeUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bridgeUrl = prefetched.bridgeUrl}
					{#if bridgeUrl !== undefined && bridgeUrl !== null}
						<div>
							<dt>bridge URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(bridgeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(bridgeUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bridgeUrl = resolvedEntity.bridgeUrl}
					{#if bridgeUrl !== undefined && bridgeUrl !== null}
						<div>
							<dt>bridge URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(bridgeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(bridgeUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							manifestUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const manifestUrl = prefetched.manifestUrl}
					{#if manifestUrl !== undefined && manifestUrl !== null}
						<div>
							<dt>manifest URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(manifestUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(manifestUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const manifestUrl = resolvedEntity.manifestUrl}
					{#if manifestUrl !== undefined && manifestUrl !== null}
						<div>
							<dt>manifest URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(manifestUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(manifestUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							origin: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const origin = prefetched.origin}
					{#if origin !== undefined && origin !== null}
						<div>
							<dt>origin</dt>
							<dd>
								{String((origin) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const origin = resolvedEntity.origin}
					{#if origin !== undefined && origin !== null}
						<div>
							<dt>origin</dt>
							<dd>
								{String((origin) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deviceId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deviceId = prefetched.deviceId}
					{#if deviceId !== undefined && deviceId !== null}
						<div>
							<dt>device ID</dt>
							<dd>
								{String((deviceId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deviceId = resolvedEntity.deviceId}
					{#if deviceId !== undefined && deviceId !== null}
						<div>
							<dt>device ID</dt>
							<dd>
								{String((deviceId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = prefetched.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAt = prefetched.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>
	{/snippet}
</EntityView>
