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
	}: EntitySelectionViewProps<EntityType.XrplTrustline_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XrplTrustlineView from '$/views/XrplTrustlineView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplTrustline_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'XRPL trustline timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>trustline</dt>
				<dd>
					<XrplTrustlineView
						selection={select(EntityType.XrplTrustline, selection.entitySelector.$trustline)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					{selection.entitySelector.ledgerIndex}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
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
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>balance</dt>
							<dd>
								{balance}
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
				{#snippet children(entity)}
					{@const limit = entity.limit}
					{#if limit != null}
						<div>
							<dt>limit</dt>
							<dd>
								{limit}
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
				{#snippet children(entity)}
					{@const limitPeer = entity.limitPeer}
					{#if limitPeer != null}
						<div>
							<dt>limit peer</dt>
							<dd>
								{limitPeer}
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
				{#snippet children(entity)}
					{@const noRipple = entity.noRipple}
					{#if noRipple != null}
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
				{#snippet children(entity)}
					{@const noRipplePeer = entity.noRipplePeer}
					{#if noRipplePeer != null}
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
				{#snippet children(entity)}
					{@const authorized = entity.authorized}
					{#if authorized != null}
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
				{#snippet children(entity)}
					{@const peerAuthorized = entity.peerAuthorized}
					{#if peerAuthorized != null}
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
