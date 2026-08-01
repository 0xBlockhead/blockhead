<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.PayjoinEndpoint_Timestamp> = $props()

	const payjoinEndpointTimestamp = $derived(selection({
		fields: {
			responseStatus: true,
			error: true,
			requiresOhttp: true,
			supportsOutputSubstitution: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
</script>


<EntityView
	entityType={EntityType.PayjoinEndpoint_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={payjoinEndpointTimestamp}>
			{#snippet children(entity)}
				{[String(entity.responseStatus ?? ''), (entity.error ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={payjoinEndpointTimestamp}>
			{#snippet children(entity)}
				{@const requiresOhttp = entity.requiresOhttp}
				{#if requiresOhttp != null}
					<span data-text="muted">
						{requiresOhttp ? 'Yes' : 'No'}
					</span>
				{/if}
				{@const supportsOutputSubstitution = entity.supportsOutputSubstitution}
				{#if supportsOutputSubstitution != null}
					<span data-text="muted">
						{supportsOutputSubstitution ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>endpoint</dt>
				<dd>
					<PayjoinEndpointView
						selection={select(EntityType.PayjoinEndpoint, selection.entitySelector.$endpoint)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={payjoinEndpointTimestamp}
			>
				{#snippet children(entity)}
					{@const supportsOutputSubstitution = entity.supportsOutputSubstitution}
					{#if supportsOutputSubstitution != null}
						<div>
							<dt>supports output substitution</dt>
							<dd>
								{supportsOutputSubstitution ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={payjoinEndpointTimestamp}
			>
				{#snippet children(entity)}
					{@const requiresOhttp = entity.requiresOhttp}
					{#if requiresOhttp != null}
						<div>
							<dt>requires ohttp</dt>
							<dd>
								{requiresOhttp ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxPayloadBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxPayloadBytes = entity.maxPayloadBytes}
					{#if maxPayloadBytes != null}
						<div>
							<dt>max payload bytes</dt>
							<dd>
								<NumberValue
									value={maxPayloadBytes}
								/>
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
							lastSeenAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSeenAt = entity.lastSeenAt}
					{#if lastSeenAt != null}
						<div>
							<dt>last seen AT</dt>
							<dd>
								<Timestamp timestamp={lastSeenAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={payjoinEndpointTimestamp}
			>
				{#snippet children(entity)}
					{@const responseStatus = entity.responseStatus}
					{#if responseStatus != null}
						<div>
							<dt>response status</dt>
							<dd>
								<NumberValue
									value={responseStatus}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={payjoinEndpointTimestamp}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
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
