<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.XmtpNetwork> = $props()

	const xmtpNetwork = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	})({
		fields: {
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
			registryName: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'XMTP')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.scope === 'XmtpNetwork' ?
					resolve('/(social)/(xmtp)/xmtp')
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xmtpNetwork}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{(prefetched.protocolName ?? '') || titleFallback}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			XMTP transports encrypted payloads between inbox identities. This hub shows local conversation state from the seeded.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={xmtpNetwork}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xmtpNetwork}
			>
				{#snippet children(entity)}
					{@const registryName = entity.registryName}
					{#if registryName != null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{registryName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xmtpNetwork}
			>
				{#snippet children(entity)}
					{@const relationshipModel = entity.relationshipModel}
					{#if relationshipModel != null}
						<div>
							<dt>Connection model</dt>
							<dd>
								{relationshipModel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary
						resource={xmtpNetwork}
					>
						{#snippet children(entity)}
							<a
								href={entity.homeUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.homeUrl} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={xmtpNetwork}
			>
				{#snippet children(entity)}
					{@const docsUrl = entity.docsUrl}
					{#if docsUrl != null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<a
									href={docsUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={docsUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const xmtpConversationsResource = selection.$$xmtpConversations}
		<ResourceBoundary
			resource={xmtpConversationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<XmtpConversationsView
						selection={xmtpConversationsResource}
						countResource={xmtpConversationsResource.count}
						title='Conversations'
						href={resolve('/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversations')}
						id='xmtp-conversations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
