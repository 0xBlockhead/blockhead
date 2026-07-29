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
	}: EntitySelectionViewProps<EntityType.FedimintFederation> = $props()

	const fedimintFederation = $derived(selection({
		fields: {
			name: true,
			consensusVersion: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.federationId || 'Fedimint federation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FedimintFederation_TimestampsView from '$/views/FedimintFederation_TimestampsView.svelte'
	import FedimintGatewaysView from '$/views/FedimintGatewaysView.svelte'
</script>


<EntityView
	entityType={EntityType.FedimintFederation}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={fedimintFederation}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={fedimintFederation}>
			{#snippet children(entity)}
				{(entity.consensusVersion ?? '') || (entity.name ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>federation ID</dt>
				<dd>
					{selection.entitySelector.federationId}
				</dd>
			</div>

			<ResourceBoundary
				resource={fedimintFederation}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={fedimintFederation}
			>
				{#snippet children(entity)}
					{@const consensusVersion = entity.consensusVersion}
					{#if consensusVersion != null}
						<div>
							<dt>consensus version</dt>
							<dd>
								{consensusVersion}
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
							guardianCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const guardianCount = entity.guardianCount}
					{#if guardianCount != null}
						<div>
							<dt>guardian count</dt>
							<dd>
								<NumberValue
									value={guardianCount}
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
							guardianThreshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const guardianThreshold = entity.guardianThreshold}
					{#if guardianThreshold != null}
						<div>
							<dt>guardian threshold</dt>
							<dd>
								<NumberValue
									value={guardianThreshold}
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
							clientConfigJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const clientConfigJson = entity.clientConfigJson}
					{#if clientConfigJson != null}
						<div>
							<dt>client config JSON</dt>
							<dd>
								{clientConfigJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleConfigJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleConfigJson = entity.moduleConfigJson}
					{#if moduleConfigJson != null}
						<div>
							<dt>module config JSON</dt>
							<dd>
								{moduleConfigJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FedimintFederation_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const gatewaysResource = selection.$$gateways}
		<ResourceBoundary
			resource={gatewaysResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FedimintGatewaysView
						selection={gatewaysResource}
						countResource={gatewaysResource.count}
						title='gateways'
						id='gateways'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
