<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.XrplTrustline_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XrplTrustline_Timestamp>>
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
	const xrplTrustlineTimestamp = $derived(selection({}))
	const titleFallback = $derived('XRPL trustline timestamp')
	const viewDomId = $derived('xrpl-trustline-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import XrplTrustlineView from '$/views/XrplTrustlineView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplTrustline_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xrplTrustlineTimestamp}>
			{#snippet Pending()}
				{title || 'XRPL trustline timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>trustline</dt>
				<dd>
					<XrplTrustlineView
						selection={select(EntityType.XrplTrustline, selection.entitySelector.$trustline, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ledgerIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ledgerIndex = selection.entitySelector.ledgerIndex ?? prefetched.ledgerIndex}
							{#if ledgerIndex !== undefined && ledgerIndex !== null}
								{String((ledgerIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerIndex = resolvedEntity.ledgerIndex}
							{#if ledgerIndex !== undefined && ledgerIndex !== null}
								{String((ledgerIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							balance: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balance = prefetched.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								{String((balance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balance = resolvedEntity.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								{String((balance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							limit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const limit = prefetched.limit}
					{#if limit !== undefined && limit !== null}
						<div>
							<dt>limit</dt>
							<dd>
								{String((limit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const limit = resolvedEntity.limit}
					{#if limit !== undefined && limit !== null}
						<div>
							<dt>limit</dt>
							<dd>
								{String((limit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							limitPeer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const limitPeer = prefetched.limitPeer}
					{#if limitPeer !== undefined && limitPeer !== null}
						<div>
							<dt>limit peer</dt>
							<dd>
								{String((limitPeer) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const limitPeer = resolvedEntity.limitPeer}
					{#if limitPeer !== undefined && limitPeer !== null}
						<div>
							<dt>limit peer</dt>
							<dd>
								{String((limitPeer) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							noRipple: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const noRipple = prefetched.noRipple}
					{#if noRipple !== undefined && noRipple !== null}
						<div>
							<dt>no ripple</dt>
							<dd>
								{noRipple ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const noRipple = resolvedEntity.noRipple}
					{#if noRipple !== undefined && noRipple !== null}
						<div>
							<dt>no ripple</dt>
							<dd>
								{noRipple ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							noRipplePeer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const noRipplePeer = prefetched.noRipplePeer}
					{#if noRipplePeer !== undefined && noRipplePeer !== null}
						<div>
							<dt>no ripple peer</dt>
							<dd>
								{noRipplePeer ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const noRipplePeer = resolvedEntity.noRipplePeer}
					{#if noRipplePeer !== undefined && noRipplePeer !== null}
						<div>
							<dt>no ripple peer</dt>
							<dd>
								{noRipplePeer ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorized: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authorized = prefetched.authorized}
					{#if authorized !== undefined && authorized !== null}
						<div>
							<dt>authorized</dt>
							<dd>
								{authorized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorized = resolvedEntity.authorized}
					{#if authorized !== undefined && authorized !== null}
						<div>
							<dt>authorized</dt>
							<dd>
								{authorized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							peerAuthorized: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const peerAuthorized = prefetched.peerAuthorized}
					{#if peerAuthorized !== undefined && peerAuthorized !== null}
						<div>
							<dt>peer authorized</dt>
							<dd>
								{peerAuthorized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerAuthorized = resolvedEntity.peerAuthorized}
					{#if peerAuthorized !== undefined && peerAuthorized !== null}
						<div>
							<dt>peer authorized</dt>
							<dd>
								{peerAuthorized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
