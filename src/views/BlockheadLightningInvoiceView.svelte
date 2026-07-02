<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningInvoice>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLightningInvoice>>
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

	const blockheadLightningInvoice = $derived(selection({
		sources: [
			Source.LightningLnd_Rest,
		],
		fields: {
			memo: true,
			valueMsat: true,
			paymentRequest: true,
			...(open && {
				createdAtMs: true,
				expirySeconds: true,
				private: true,
				addIndex: true,
				$localNodeState: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).memo) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice')
	const viewDomId = $derived('blockhead-lightning-invoice-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningInvoice}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/invoices/[paymentHash]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			paymentHash: String(({ ...selection.entitySelector, ...prefetched }).paymentHash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).memo) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice'}
		{:else}
			<ResourceBoundary resource={blockheadLightningInvoice}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).memo) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.memo) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const valueMsat0 = ({ ...selection.entitySelector, ...prefetched }).valueMsat}
			{#if valueMsat0 !== undefined && valueMsat0 !== null}
				<NumberValue value={Number(valueMsat0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadLightningInvoice}>
				{#snippet Pending()}
					{@const valueMsat0 = ({ ...selection.entitySelector, ...prefetched }).valueMsat}
					{#if valueMsat0 !== undefined && valueMsat0 !== null}
						<NumberValue value={Number(valueMsat0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const valueMsat0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).valueMsat}
					{#if valueMsat0 !== undefined && valueMsat0 !== null}
						<NumberValue value={Number(valueMsat0)} />
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
			<ResourceBoundary resource={blockheadLightningInvoice}>
				{#snippet Pending()}
					{@const createdAtMs = prefetched.createdAtMs ?? selection.entitySelector.createdAtMs}
					{#if createdAtMs !== undefined && createdAtMs !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAtMs = entity.createdAtMs ?? selection.entitySelector.createdAtMs ?? prefetched.createdAtMs}
					{#if createdAtMs !== undefined && createdAtMs !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadLightningInvoice}>
				{#snippet Pending()}
					{@const expirySeconds = prefetched.expirySeconds ?? selection.entitySelector.expirySeconds}
					{#if expirySeconds !== undefined && expirySeconds !== null}
						<div>
							<dt>Expiry seconds</dt>
							<dd>
								<NumberValue value={Number(expirySeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const expirySeconds = entity.expirySeconds ?? selection.entitySelector.expirySeconds ?? prefetched.expirySeconds}
					{#if expirySeconds !== undefined && expirySeconds !== null}
						<div>
							<dt>Expiry seconds</dt>
							<dd>
								<NumberValue value={Number(expirySeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadLightningInvoice}>
				{#snippet Pending()}
					{@const privateValue = prefetched.private ?? selection.entitySelector.private}
					{#if privateValue !== undefined && privateValue !== null}
						<div>
							<dt>Private</dt>
							<dd>
								{String((privateValue) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const privateValue = entity.private ?? selection.entitySelector.private ?? prefetched.private}
					{#if privateValue !== undefined && privateValue !== null}
						<div>
							<dt>Private</dt>
							<dd>
								{String((privateValue) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadLightningInvoice}>
				{#snippet Pending()}
					{@const addIndex = prefetched.addIndex ?? selection.entitySelector.addIndex}
					{#if addIndex !== undefined && addIndex !== null}
						<div>
							<dt>Add index</dt>
							<dd>
								<NumberValue value={Number(addIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const addIndex = entity.addIndex ?? selection.entitySelector.addIndex ?? prefetched.addIndex}
					{#if addIndex !== undefined && addIndex !== null}
						<div>
							<dt>Add index</dt>
							<dd>
								<NumberValue value={Number(addIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadLightningInvoice}>
				{#snippet Pending()}
					{@const paymentRequest = prefetched.paymentRequest ?? selection.entitySelector.paymentRequest}
					{#if paymentRequest !== undefined && paymentRequest !== null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue value={String(paymentRequest)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const paymentRequest = entity.paymentRequest ?? selection.entitySelector.paymentRequest ?? prefetched.paymentRequest}
					{#if paymentRequest !== undefined && paymentRequest !== null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue value={String(paymentRequest)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
