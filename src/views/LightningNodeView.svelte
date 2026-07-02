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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNode>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LightningNode>>
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

	const lightningNode = $derived(selection({
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
		fields: {
			alias: true,
			capacitySats: true,
			channelCount: true,
			...(open && {
				countryCode: true,
				city: true,
				networkAddresses: true,
				$$timestamps: true,
				$$channels: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).alias) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node')
	const viewDomId = $derived('lightning-node-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNode}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			pubkey: String(({ ...selection.entitySelector, ...prefetched }).publicKey),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).alias) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node'}
		{:else}
			<ResourceBoundary resource={lightningNode}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).alias) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.alias) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const channelCount0 = ({ ...selection.entitySelector, ...prefetched }).channelCount}
			{#if channelCount0 !== undefined && channelCount0 !== null}
				<NumberValue value={Number(channelCount0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={lightningNode}>
				{#snippet Pending()}
					{@const channelCount0 = ({ ...selection.entitySelector, ...prefetched }).channelCount}
					{#if channelCount0 !== undefined && channelCount0 !== null}
						<NumberValue value={Number(channelCount0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const channelCount0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).channelCount}
					{#if channelCount0 !== undefined && channelCount0 !== null}
						<NumberValue value={Number(channelCount0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
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
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lightningNode}>
				{#snippet Pending()}
					{@const capacitySats = prefetched.capacitySats ?? selection.entitySelector.capacitySats}
					{#if capacitySats !== undefined && capacitySats !== null}
						<div>
							<dt>Capacity sats</dt>
							<dd>
								<NumberValue value={Number(capacitySats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const capacitySats = entity.capacitySats ?? selection.entitySelector.capacitySats ?? prefetched.capacitySats}
					{#if capacitySats !== undefined && capacitySats !== null}
						<div>
							<dt>Capacity sats</dt>
							<dd>
								<NumberValue value={Number(capacitySats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={lightningNode}>
				{#snippet Pending()}
					{@const countryCode = prefetched.countryCode ?? selection.entitySelector.countryCode}
					{#if countryCode !== undefined && countryCode !== null}
						<div>
							<dt>Country</dt>
							<dd>
								{String((countryCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const countryCode = entity.countryCode ?? selection.entitySelector.countryCode ?? prefetched.countryCode}
					{#if countryCode !== undefined && countryCode !== null}
						<div>
							<dt>Country</dt>
							<dd>
								{String((countryCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={lightningNode}>
				{#snippet Pending()}
					{@const city = prefetched.city ?? selection.entitySelector.city}
					{#if city !== undefined && city !== null}
						<div>
							<dt>City</dt>
							<dd>
								{String((city) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const city = entity.city ?? selection.entitySelector.city ?? prefetched.city}
					{#if city !== undefined && city !== null}
						<div>
							<dt>City</dt>
							<dd>
								{String((city) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={lightningNode}>
				{#snippet Pending()}
					{@const networkAddresses = prefetched.networkAddresses ?? selection.entitySelector.networkAddresses}
					{#if networkAddresses !== undefined && networkAddresses !== null}
						<div>
							<dt>Network addresses</dt>
							<dd>
								{networkAddresses == null ? '' : String(((networkAddresses).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const networkAddresses = entity.networkAddresses ?? selection.entitySelector.networkAddresses ?? prefetched.networkAddresses}
					{#if networkAddresses !== undefined && networkAddresses !== null}
						<div>
							<dt>Network addresses</dt>
							<dd>
								{networkAddresses == null ? '' : String(((networkAddresses).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<LightningChannelsView
				selection={selection[EntityProxyField]<EntityType.LightningChannel>('$$channels')}
				title='Channels'
				emptyText='No channels yet.'
				id='LightningChannelsView-$$channels'
			/>
		{/if}
	{/snippet}
</EntityView>
