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
	}: EntitySelectionViewProps<EntityType.Eip8004EndpointDomainVerification_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const eip8004EndpointDomainVerificationTimestamp = $derived(selection({
		fields: {
			verified: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.endpointUrl ?? '') || 'EIP-8004 endpoint domain verification timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004EndpointDomainVerification_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<a
			href={String(pendingEntity.endpointUrl)}
			target="_blank"
			rel="noreferrer noopener"
		>
			<TruncatedValue value={String(pendingEntity.endpointUrl)} />
		</a>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eip8004EndpointDomainVerificationTimestamp}>
			{#snippet children(entity)}
				{String(entity.verified ?? '') || pendingEntity.endpointUrl || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Endpoint URL</dt>
				<dd>
					<a
						href={String(pendingEntity.endpointUrl)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.endpointUrl)} />
					</a>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={eip8004EndpointDomainVerificationTimestamp}
			>
				{#snippet children(entity)}
					{@const verified = entity.verified}
					{#if verified != null}
						<div>
							<dt>Verified</dt>
							<dd>
								{verified ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
