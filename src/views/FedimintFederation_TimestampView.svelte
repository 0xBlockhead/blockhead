<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.FedimintFederation_Timestamp> = $props()

	const fedimintFederationTimestamp = $derived(selection({
		fields: {
			health: true,
			reachable: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FedimintFederationView from '$/views/FedimintFederationView.svelte'
</script>


<EntityView
	entityType={EntityType.FedimintFederation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={fedimintFederationTimestamp}>
			{#snippet children(entity)}
				{[(entity.health ?? ''), String(entity.reachable ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>federation</dt>
				<dd>
					<FedimintFederationView
						selection={select(EntityType.FedimintFederation, selection.entitySelector.$federation)}
						layout={EntityLayout.Value}
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

			<ResourceBoundary
				resource={fedimintFederationTimestamp}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={fedimintFederationTimestamp}
			>
				{#snippet children(entity)}
					{@const health = entity.health}
					{#if health != null}
						<div>
							<dt>health</dt>
							<dd>
								{health}
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
							gatewayCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gatewayCount = entity.gatewayCount}
					{#if gatewayCount != null}
						<div>
							<dt>gateway count</dt>
							<dd>
								<NumberValue
									value={gatewayCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clientConfigHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const clientConfigHash = entity.clientConfigHash}
					{#if clientConfigHash != null}
						<div>
							<dt>client config hash</dt>
							<dd>
								<TruncatedValue value={clientConfigHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleConfigHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleConfigHash = entity.moduleConfigHash}
					{#if moduleConfigHash != null}
						<div>
							<dt>module config hash</dt>
							<dd>
								<TruncatedValue value={moduleConfigHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							peerStatusJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const peerStatusJson = entity.peerStatusJson}
					{#if peerStatusJson != null}
						<div>
							<dt>peer status JSON</dt>
							<dd>
								{peerStatusJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metaJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metaJson = entity.metaJson}
					{#if metaJson != null}
						<div>
							<dt>meta JSON</dt>
							<dd>
								{metaJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							inviteCodeObserved: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inviteCodeObserved = entity.inviteCodeObserved}
					{#if inviteCodeObserved != null}
						<div>
							<dt>invite code observed</dt>
							<dd>
								{inviteCodeObserved ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
