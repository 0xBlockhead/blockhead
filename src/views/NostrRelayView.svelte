<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.NostrRelay>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NostrRelay>>
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

	const nostrRelay = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			description: true,
			software: true,
			version: true,
			supportedNipCount: true,
			isPaid: true,
			limit: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay')
	const viewDomId = $derived('nostr-relay-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay'}
		{:else}
			<ResourceBoundary resource={nostrRelay}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.relayUrl) ?? '')].filter(Boolean).join(' ') || 'Nostr relay'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={nostrRelay}>
					{#snippet Pending()}
						{@const description = prefetched.description ?? selection.entitySelector.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const description = entity.description ?? selection.entitySelector.description ?? prefetched.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={nostrRelay}>
					{#snippet Pending()}
						{@const software = prefetched.software ?? selection.entitySelector.software}
						{#if software !== undefined && software !== null}
							<div>
								<dt>Software</dt>
								<dd>
									{String((software) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const software = entity.software ?? selection.entitySelector.software ?? prefetched.software}
						{#if software !== undefined && software !== null}
							<div>
								<dt>Software</dt>
								<dd>
									{String((software) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={nostrRelay}>
					{#snippet Pending()}
						{@const version = prefetched.version ?? selection.entitySelector.version}
						{#if version !== undefined && version !== null}
							<div>
								<dt>Version</dt>
								<dd>
									{String((version) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const version = entity.version ?? selection.entitySelector.version ?? prefetched.version}
						{#if version !== undefined && version !== null}
							<div>
								<dt>Version</dt>
								<dd>
									{String((version) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={nostrRelay}>
					{#snippet Pending()}
						{@const supportedNipCount = prefetched.supportedNipCount ?? selection.entitySelector.supportedNipCount}
						{#if supportedNipCount !== undefined && supportedNipCount !== null}
							<div>
								<dt>Supported NIPs</dt>
								<dd>
									<NumberValue value={Number(supportedNipCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const supportedNipCount = entity.supportedNipCount ?? selection.entitySelector.supportedNipCount ?? prefetched.supportedNipCount}
						{#if supportedNipCount !== undefined && supportedNipCount !== null}
							<div>
								<dt>Supported NIPs</dt>
								<dd>
									<NumberValue value={Number(supportedNipCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={nostrRelay}>
					{#snippet Pending()}
						{@const isPaid = prefetched.isPaid ?? selection.entitySelector.isPaid}
						{#if isPaid !== undefined && isPaid !== null}
							<div>
								<dt>Paid relay</dt>
								<dd>
									{String((isPaid) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const isPaid = entity.isPaid ?? selection.entitySelector.isPaid ?? prefetched.isPaid}
						{#if isPaid !== undefined && isPaid !== null}
							<div>
								<dt>Paid relay</dt>
								<dd>
									{String((isPaid) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={nostrRelay}>
					{#snippet Pending()}
						{@const limit = prefetched.limit ?? selection.entitySelector.limit}
						{#if limit !== undefined && limit !== null}
							<div>
								<dt>Event limit</dt>
								<dd>
									<NumberValue value={Number(limit)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const limit = entity.limit ?? selection.entitySelector.limit ?? prefetched.limit}
						{#if limit !== undefined && limit !== null}
							<div>
								<dt>Event limit</dt>
								<dd>
									<NumberValue value={Number(limit)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
