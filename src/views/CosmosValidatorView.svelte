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
	}: EntitySelectionViewProps<EntityType.CosmosValidator> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const cosmosValidator = $derived(selection({
		fields: {
			moniker: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.moniker ?? ''), (pendingEntity.operatorAddress ?? '')].filter(Boolean).join(' ') || 'Cosmos validator')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosValidator_TimestampsView from '$/views/CosmosValidator_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosValidator}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosValidator}>
			{#snippet children(entity)}
				{[(entity.moniker ?? ''), pendingEntity.operatorAddress].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={pendingEntity.operatorAddress} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Operator address</dt>
				<dd>
					<TruncatedValue value={pendingEntity.operatorAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const consensusPubkey = entity.consensusPubkey}
					{#if consensusPubkey != null}
						<div>
							<dt>Consensus public key</dt>
							<dd>
								<TruncatedValue value={consensusPubkey} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cosmosValidator}
			>
				{#snippet children(entity)}
					{@const moniker = entity.moniker}
					{#if moniker != null}
						<div>
							<dt>Moniker</dt>
							<dd>
								{moniker}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							identity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const identity = entity.identity}
					{#if identity != null}
						<div>
							<dt>Identity</dt>
							<dd>
								{identity}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							website: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const website = entity.website}
					{#if website != null}
						<div>
							<dt>Website</dt>
							<dd>
								<a
									href={String(website)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(website)} />
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
							securityContact: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const securityContact = entity.securityContact}
					{#if securityContact != null}
						<div>
							<dt>Security contact</dt>
							<dd>
								<a
									href={String(securityContact)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(securityContact)} />
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
							details: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const details = entity.details}
					{#if details != null}
						<div>
							<dt>Details</dt>
							<dd>
								{details}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const cosmosValidatorCosmosValidatorTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={cosmosValidatorCosmosValidatorTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CosmosValidator_TimestampsView
						selection={cosmosValidatorCosmosValidatorTimestampsViewTimestampsResource}
						countResource={cosmosValidatorCosmosValidatorTimestampsViewTimestampsResource.count}
						title='Validator snapshots'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
