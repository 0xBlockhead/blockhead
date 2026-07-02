<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosValidator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosValidator>>
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

	const cosmosValidator = $derived(selection({
		fields: {
			moniker: true,
			consensusPubkey: true,
			identity: true,
			website: true,
			securityContact: true,
			details: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).moniker) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).operatorAddress) ?? '')].filter(Boolean).join(' ') || 'Cosmos validator')
	const viewDomId = $derived('cosmos-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosValidator_TimestampsView from '$/views/CosmosValidator_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosValidator}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			operatorAddress: String(({ ...selection.entitySelector, ...prefetched }).operatorAddress),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).moniker) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).operatorAddress) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator'}
		{:else}
			<ResourceBoundary resource={cosmosValidator}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).moniker) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).operatorAddress) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.moniker) ?? ''), String((entity.operatorAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const operatorAddress0 = ({ ...selection.entitySelector, ...prefetched }).operatorAddress}
			{#if operatorAddress0 !== undefined && operatorAddress0 !== null}
				<TruncatedValue value={String(operatorAddress0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosValidator}>
				{#snippet Pending()}
					{@const operatorAddress0 = ({ ...selection.entitySelector, ...prefetched }).operatorAddress}
					{#if operatorAddress0 !== undefined && operatorAddress0 !== null}
						<TruncatedValue value={String(operatorAddress0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const operatorAddress0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).operatorAddress}
					{#if operatorAddress0 !== undefined && operatorAddress0 !== null}
						<TruncatedValue value={String(operatorAddress0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
						}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={cosmosValidator}>
				{#snippet Pending()}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosValidator}>
				{#snippet Pending()}
					{@const consensusPubkey = prefetched.consensusPubkey ?? selection.entitySelector.consensusPubkey}
					{#if consensusPubkey !== undefined && consensusPubkey !== null}
						<div>
							<dt>Consensus public key</dt>
							<dd>
								<TruncatedValue value={String(consensusPubkey)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const consensusPubkey = entity.consensusPubkey ?? selection.entitySelector.consensusPubkey ?? prefetched.consensusPubkey}
					{#if consensusPubkey !== undefined && consensusPubkey !== null}
						<div>
							<dt>Consensus public key</dt>
							<dd>
								<TruncatedValue value={String(consensusPubkey)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosValidator}>
				{#snippet Pending()}
					{@const identity = prefetched.identity ?? selection.entitySelector.identity}
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
					{@const identity = entity.identity ?? selection.entitySelector.identity ?? prefetched.identity}
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

			<ResourceBoundary resource={cosmosValidator}>
				{#snippet Pending()}
					{@const website = prefetched.website ?? selection.entitySelector.website}
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
					{@const website = entity.website ?? selection.entitySelector.website ?? prefetched.website}
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

			<ResourceBoundary resource={cosmosValidator}>
				{#snippet Pending()}
					{@const securityContact = prefetched.securityContact ?? selection.entitySelector.securityContact}
					{#if securityContact !== undefined && securityContact !== null}
						<div>
							<dt>Security contact</dt>
							<dd>
								{String((securityContact) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const securityContact = entity.securityContact ?? selection.entitySelector.securityContact ?? prefetched.securityContact}
					{#if securityContact !== undefined && securityContact !== null}
						<div>
							<dt>Security contact</dt>
							<dd>
								{String((securityContact) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosValidator}>
				{#snippet Pending()}
					{@const details = prefetched.details ?? selection.entitySelector.details}
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
					{@const details = entity.details ?? selection.entitySelector.details ?? prefetched.details}
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
				selection={selection[EntityProxyField]<EntityType.CosmosValidator_Timestamp>('$$timestamps')}
				title='Validator snapshots'
				emptyText='No Cosmos validator observations.'
				id='CosmosValidator_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
