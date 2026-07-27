<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GitObjectVerification_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitObjectVerificationTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.objectId ?? '') || 'Git object verification timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.GitObjectVerification_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.objectId ?? '') || 'Git object verification timestamp'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitObjectVerificationTimestamp}>
			{#snippet children(entity)}
				{entity.status || String(pendingEntity.objectId) || titleFallback}
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
				<dt>object ID</dt>
				<dd>
					{String(pendingEntity.objectId)}
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					{pendingEntity.objectFormat}
				</dd>
			</div>

			<div>
				<dt>byte source</dt>
				<dd>
					{pendingEntity.byteSource}
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

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={gitObjectVerificationTimestamp}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifier: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifier = entity.verifier}
					{#if verifier != null}
						<div>
							<dt>verifier</dt>
							<dd>
								{verifier}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							objectKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const objectKind = entity.objectKind}
					{#if objectKind != null}
						<div>
							<dt>object kind</dt>
							<dd>
								{objectKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							headerBytesHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const headerBytesHash = entity.headerBytesHash}
					{#if headerBytesHash != null}
						<div>
							<dt>header bytes hash</dt>
							<dd>
								<TruncatedValue value={String(headerBytesHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadBytesHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadBytesHash = entity.payloadBytesHash}
					{#if payloadBytesHash != null}
						<div>
							<dt>payload bytes hash</dt>
							<dd>
								<TruncatedValue value={String(payloadBytesHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							computedObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const computedObjectId = entity.computedObjectId}
					{#if computedObjectId != null}
						<div>
							<dt>computed object ID</dt>
							<dd>
								{String(computedObjectId)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canonicalEncoding: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const canonicalEncoding = entity.canonicalEncoding}
					{#if canonicalEncoding != null}
						<div>
							<dt>canonical encoding</dt>
							<dd>
								{canonicalEncoding ? 'Yes' : 'No'}
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
