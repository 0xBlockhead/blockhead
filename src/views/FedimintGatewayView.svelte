<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FedimintGateway> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const fedimintGateway = $derived(selection({
		fields: {
			apiUrl: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.gatewayId ?? '') || 'Fedimint gateway')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FedimintGateway_TimestampsView from '$/views/FedimintGateway_TimestampsView.svelte'
	import FedimintFederationsView from '$/views/FedimintFederationsView.svelte'
</script>


<EntityView
	entityType={EntityType.FedimintGateway}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.gatewayId ?? '') || 'Fedimint gateway'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={fedimintGateway}>
			{#snippet children(entity)}
				{(entity.apiUrl ?? '') || pendingEntity.gatewayId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>gateway ID</dt>
				<dd>
					{pendingEntity.gatewayId}
				</dd>
			</div>

			<ResourceBoundary
				resource={fedimintGateway}
			>
				{#snippet children(entity)}
					{@const apiUrl = entity.apiUrl}
					{#if apiUrl != null}
						<div>
							<dt>API URL</dt>
							<dd>
								<a
									href={String(apiUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(apiUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodePubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodePubkey = entity.nodePubkey}
					{#if nodePubkey != null}
						<div>
							<dt>node public key</dt>
							<dd>
								{nodePubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const fedimintGatewayFedimintGatewayTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={fedimintGatewayFedimintGatewayTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FedimintGateway_TimestampsView
						selection={fedimintGatewayFedimintGatewayTimestampsViewTimestampsResource}
						countResource={fedimintGatewayFedimintGatewayTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const fedimintGatewayFedimintFederationsViewFederationsResource = selection.$$federations}
		<ResourceBoundary
			resource={fedimintGatewayFedimintFederationsViewFederationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FedimintFederationsView
						selection={fedimintGatewayFedimintFederationsViewFederationsResource}
						countResource={fedimintGatewayFedimintFederationsViewFederationsResource.count}
						title='federations'
						id='federations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
