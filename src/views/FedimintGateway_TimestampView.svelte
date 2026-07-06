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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintGateway_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FedimintGateway_Timestamp>>
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
	const fedimintGatewayTimestamp = $derived(selection({
		fields: {
			online: true,
			version: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Fedimint gateway timestamp')
	const viewDomId = $derived('fedimint-gateway-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FedimintGatewayView from '$/views/FedimintGatewayView.svelte'
</script>


<EntityView
	entityType={EntityType.FedimintGateway_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={fedimintGatewayTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={fedimintGatewayTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.online) ?? ''), String((prefetched.version) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'Fedimint gateway timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.online) ?? ''), String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={fedimintGatewayTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>gateway</dt>
				<dd>
					<FedimintGatewayView
						selection={select(EntityType.FedimintGateway, selection.entitySelector.$gateway)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
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
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
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
				resource={
					selection({
						fields: {
							online: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const online = prefetched.online}
					{#if online !== undefined && online !== null}
						<div>
							<dt>online</dt>
							<dd>
								{online ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const online = resolvedEntity.online}
					{#if online !== undefined && online !== null}
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
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
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
				{#snippet Pending()}
					{@const lightningAlias = prefetched.lightningAlias}
					{#if lightningAlias !== undefined && lightningAlias !== null}
						<div>
							<dt>Lightning alias</dt>
							<dd>
								{String((lightningAlias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lightningAlias = resolvedEntity.lightningAlias}
					{#if lightningAlias !== undefined && lightningAlias !== null}
						<div>
							<dt>Lightning alias</dt>
							<dd>
								{String((lightningAlias) ?? '')}
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
				{#snippet Pending()}
					{@const routingFeesJson = prefetched.routingFeesJson}
					{#if routingFeesJson !== undefined && routingFeesJson !== null}
						<div>
							<dt>routing fees JSON</dt>
							<dd>
								{String((routingFeesJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const routingFeesJson = resolvedEntity.routingFeesJson}
					{#if routingFeesJson !== undefined && routingFeesJson !== null}
						<div>
							<dt>routing fees JSON</dt>
							<dd>
								{String((routingFeesJson) ?? '')}
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
				{#snippet Pending()}
					{@const federationsCount = prefetched.federationsCount}
					{#if federationsCount !== undefined && federationsCount !== null}
						<div>
							<dt>federations count</dt>
							<dd>
								<NumberValue value={Number(federationsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const federationsCount = resolvedEntity.federationsCount}
					{#if federationsCount !== undefined && federationsCount !== null}
						<div>
							<dt>federations count</dt>
							<dd>
								<NumberValue value={Number(federationsCount)} />
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
				{#snippet Pending()}
					{@const lightningBalanceMsat = prefetched.lightningBalanceMsat}
					{#if lightningBalanceMsat !== undefined && lightningBalanceMsat !== null}
						<div>
							<dt>Lightning balance msat</dt>
							<dd>
								<NumberValue value={Number(lightningBalanceMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lightningBalanceMsat = resolvedEntity.lightningBalanceMsat}
					{#if lightningBalanceMsat !== undefined && lightningBalanceMsat !== null}
						<div>
							<dt>Lightning balance msat</dt>
							<dd>
								<NumberValue value={Number(lightningBalanceMsat)} />
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
				{#snippet Pending()}
					{@const ecashBalanceMsat = prefetched.ecashBalanceMsat}
					{#if ecashBalanceMsat !== undefined && ecashBalanceMsat !== null}
						<div>
							<dt>ecash balance msat</dt>
							<dd>
								<NumberValue value={Number(ecashBalanceMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ecashBalanceMsat = resolvedEntity.ecashBalanceMsat}
					{#if ecashBalanceMsat !== undefined && ecashBalanceMsat !== null}
						<div>
							<dt>ecash balance msat</dt>
							<dd>
								<NumberValue value={Number(ecashBalanceMsat)} />
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
				{#snippet Pending()}
					{@const onchainBalanceSats = prefetched.onchainBalanceSats}
					{#if onchainBalanceSats !== undefined && onchainBalanceSats !== null}
						<div>
							<dt>onchain balance sats</dt>
							<dd>
								<NumberValue value={Number(onchainBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const onchainBalanceSats = resolvedEntity.onchainBalanceSats}
					{#if onchainBalanceSats !== undefined && onchainBalanceSats !== null}
						<div>
							<dt>onchain balance sats</dt>
							<dd>
								<NumberValue value={Number(onchainBalanceSats)} />
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
				{#snippet Pending()}
					{@const channelsJson = prefetched.channelsJson}
					{#if channelsJson !== undefined && channelsJson !== null}
						<div>
							<dt>channels JSON</dt>
							<dd>
								{String((channelsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const channelsJson = resolvedEntity.channelsJson}
					{#if channelsJson !== undefined && channelsJson !== null}
						<div>
							<dt>channels JSON</dt>
							<dd>
								{String((channelsJson) ?? '')}
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
				{#snippet Pending()}
					{@const paymentSummaryJson = prefetched.paymentSummaryJson}
					{#if paymentSummaryJson !== undefined && paymentSummaryJson !== null}
						<div>
							<dt>payment summary JSON</dt>
							<dd>
								{String((paymentSummaryJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentSummaryJson = resolvedEntity.paymentSummaryJson}
					{#if paymentSummaryJson !== undefined && paymentSummaryJson !== null}
						<div>
							<dt>payment summary JSON</dt>
							<dd>
								{String((paymentSummaryJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
