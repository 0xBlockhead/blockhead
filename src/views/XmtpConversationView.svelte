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
			selection: EntityProxyResource<typeof schema, EntityType.XmtpConversation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XmtpConversation>>
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

	const xmtpConversation = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			peerInboxId: true,
			topic: true,
			createdAtMs: true,
			consentState: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).topic) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).peerInboxId) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || 'XMTP conversation')
	const viewDomId = $derived('xmtp-conversation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpConversation}
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
			{[String((({ ...selection.entitySelector, ...prefetched }).topic) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).peerInboxId) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'XMTP conversation'}
		{:else}
			<ResourceBoundary resource={xmtpConversation}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).topic) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).peerInboxId) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).id) ?? '')].filter(Boolean).join(' ') || title || 'XMTP conversation'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.topic) ?? ''), String((entity.peerInboxId) ?? ''), String((entity.id) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
			{#if id0 !== undefined && id0 !== null}
				<TruncatedValue value={String(id0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={xmtpConversation}>
				{#snippet Pending()}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const id0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).id}
					{#if id0 !== undefined && id0 !== null}
						<TruncatedValue value={String(id0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAtMs0 = prefetched.createdAtMs}
			{#if createdAtMs0 !== undefined && createdAtMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAtMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={xmtpConversation}>
				{#snippet Pending()}
					{@const createdAtMs0 = prefetched.createdAtMs}
					{#if createdAtMs0 !== undefined && createdAtMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAtMs0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAtMs0 = entity.createdAtMs}
					{#if createdAtMs0 !== undefined && createdAtMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAtMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={xmtpConversation}>
				{#snippet Pending()}
					{@const consentState = prefetched.consentState ?? selection.entitySelector.consentState}
					{#if consentState !== undefined && consentState !== null}
						<div>
							<dt>Consent</dt>
							<dd>
								{String((consentState) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const consentState = entity.consentState ?? selection.entitySelector.consentState ?? prefetched.consentState}
					{#if consentState !== undefined && consentState !== null}
						<div>
							<dt>Consent</dt>
							<dd>
								{String((consentState) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
