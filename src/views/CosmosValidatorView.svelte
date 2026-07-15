<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.CosmosValidator>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CosmosValidator>>
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
	const cosmosValidator = $derived(selection({
		fields: {
			moniker: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.moniker) ?? ''), String((pendingEntity.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'Cosmos validator')
	const viewDomId = $derived('cosmos-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosValidator_TimestampsView from '$/views/CosmosValidator_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosValidator}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosValidator}>
			{#snippet Pending()}
				{[String((pendingEntity.moniker) ?? ''), String((pendingEntity.operatorAddress) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.moniker) ?? ''), String((resolvedEntity.operatorAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosValidator}>
			{#snippet Pending()}
				{@const operatorAddress0 = pendingEntity.operatorAddress}
				{#if operatorAddress0 !== undefined && operatorAddress0 !== null}
					<TruncatedValue value={String((operatorAddress0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const operatorAddress0 = resolvedEntity.operatorAddress}
				{#if operatorAddress0 !== undefined && operatorAddress0 !== null}
					<TruncatedValue value={String((operatorAddress0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosValidator}>
			{#snippet Pending()}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Operator address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operatorAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operatorAddress = pendingEntity.operatorAddress}
							{#if operatorAddress !== undefined && operatorAddress !== null}
								<TruncatedValue value={String((operatorAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operatorAddress = resolvedEntity.operatorAddress}
							{#if operatorAddress !== undefined && operatorAddress !== null}
								<TruncatedValue value={String((operatorAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const consensusPubkey = pendingEntity.consensusPubkey}
					{#if consensusPubkey !== undefined && consensusPubkey !== null}
						<div>
							<dt>Consensus public key</dt>
							<dd>
								<TruncatedValue value={String((consensusPubkey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusPubkey = resolvedEntity.consensusPubkey}
					{#if consensusPubkey !== undefined && consensusPubkey !== null}
						<div>
							<dt>Consensus public key</dt>
							<dd>
								<TruncatedValue value={String((consensusPubkey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moniker: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moniker = pendingEntity.moniker}
					{#if moniker !== undefined && moniker !== null}
						<div>
							<dt>Moniker</dt>
							<dd>
								{String((moniker) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moniker = resolvedEntity.moniker}
					{#if moniker !== undefined && moniker !== null}
						<div>
							<dt>Moniker</dt>
							<dd>
								{String((moniker) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
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
				{#snippet Pending()}
					{@const identity = pendingEntity.identity}
					{#if identity !== undefined && identity !== null}
						<div>
							<dt>Identity</dt>
							<dd>
								{String((identity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const identity = resolvedEntity.identity}
					{#if identity !== undefined && identity !== null}
						<div>
							<dt>Identity</dt>
							<dd>
								{String((identity) ?? '')}
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
				{#snippet Pending()}
					{@const website = pendingEntity.website}
					{#if website !== undefined && website !== null}
						<div>
							<dt>Website</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(website)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(website)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const website = resolvedEntity.website}
					{#if website !== undefined && website !== null}
						<div>
							<dt>Website</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(website)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(website)} />
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
							securityContact: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const securityContact = pendingEntity.securityContact}
					{#if securityContact !== undefined && securityContact !== null}
						<div>
							<dt>Security contact</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(securityContact)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(securityContact)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const securityContact = resolvedEntity.securityContact}
					{#if securityContact !== undefined && securityContact !== null}
						<div>
							<dt>Security contact</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(securityContact)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(securityContact)} />
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
							details: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const details = pendingEntity.details}
					{#if details !== undefined && details !== null}
						<div>
							<dt>Details</dt>
							<dd>
								{String((details) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const details = resolvedEntity.details}
					{#if details !== undefined && details !== null}
						<div>
							<dt>Details</dt>
							<dd>
								{String((details) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CosmosValidator_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Validator snapshots'
				emptyText='No Cosmos validator observations.'
				id='CosmosValidator_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
