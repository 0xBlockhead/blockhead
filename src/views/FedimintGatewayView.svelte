<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FedimintGateway>, 'prefetched'> = $props()

	const fedimintGateway = $derived(selection({
		fields: {
			apiUrl: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.gatewayId || 'Fedimint gateway')


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
	{#snippet Value()}
		<ResourceBoundary resource={fedimintGateway}>
			{#snippet children(entity)}
				{(entity.apiUrl ?? '') || selection.entitySelector.gatewayId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>gateway ID</dt>
				<dd>
					{selection.entitySelector.gatewayId}
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
									href={apiUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={apiUrl} />
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

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FedimintGateway_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const federationsResource = selection.$$federations}
		<ResourceBoundary
			resource={federationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FedimintFederationsView
						selection={federationsResource}
						countResource={federationsResource.count}
						title='federations'
						id='federations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
