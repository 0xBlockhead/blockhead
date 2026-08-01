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
	}: EntitySelectionViewProps<EntityType.FedimintGateway_Timestamp> = $props()

	const fedimintGatewayTimestamp = $derived(selection({
		fields: {
			online: true,
			version: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FedimintGatewayView from '$/views/FedimintGatewayView.svelte'
</script>


<EntityView
	entityType={EntityType.FedimintGateway_Timestamp}
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
		<ResourceBoundary resource={fedimintGatewayTimestamp}>
			{#snippet children(entity)}
				{[String(entity.online ?? ''), (entity.version ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
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
				<dt>gateway</dt>
				<dd>
					<FedimintGatewayView
						selection={select(EntityType.FedimintGateway, selection.entitySelector.$gateway)}
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
				resource={
					selection({
						fields: {
							reachable: true,
						},
					})
				}
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
				resource={fedimintGatewayTimestamp}
			>
				{#snippet children(entity)}
					{@const online = entity.online}
					{#if online != null}
						<div>
							<dt>online</dt>
							<dd>
								{online ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={fedimintGatewayTimestamp}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lightningAlias: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lightningAlias = entity.lightningAlias}
					{#if lightningAlias != null}
						<div>
							<dt>Lightning alias</dt>
							<dd>
								{lightningAlias}
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
							routingFeesJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const routingFeesJson = entity.routingFeesJson}
					{#if routingFeesJson != null}
						<div>
							<dt>routing fees JSON</dt>
							<dd>
								{routingFeesJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							federationsCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const federationsCount = entity.federationsCount}
					{#if federationsCount != null}
						<div>
							<dt>federations count</dt>
							<dd>
								<NumberValue
									value={federationsCount}
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
							lightningBalanceMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lightningBalanceMsat = entity.lightningBalanceMsat}
					{#if lightningBalanceMsat != null}
						<div>
							<dt>Lightning balance msat</dt>
							<dd>
								<NumberValue
									value={lightningBalanceMsat}
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
							ecashBalanceMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ecashBalanceMsat = entity.ecashBalanceMsat}
					{#if ecashBalanceMsat != null}
						<div>
							<dt>ecash balance msat</dt>
							<dd>
								<NumberValue
									value={ecashBalanceMsat}
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
							onchainBalanceSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const onchainBalanceSats = entity.onchainBalanceSats}
					{#if onchainBalanceSats != null}
						<div>
							<dt>onchain balance sats</dt>
							<dd>
								<NumberValue
									value={onchainBalanceSats}
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
					selection({
						fields: {
							channelsJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const channelsJson = entity.channelsJson}
					{#if channelsJson != null}
						<div>
							<dt>channels JSON</dt>
							<dd>
								{channelsJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							paymentSummaryJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const paymentSummaryJson = entity.paymentSummaryJson}
					{#if paymentSummaryJson != null}
						<div>
							<dt>payment summary JSON</dt>
							<dd>
								{paymentSummaryJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
