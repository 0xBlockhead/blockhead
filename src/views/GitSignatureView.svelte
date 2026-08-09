<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.GitSignature>, 'prefetched'> = $props()

	const gitSignature = $derived(selection({
		fields: {
			verificationStatus: true,
			signatureKind: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.signatureId || 'Git signature')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.GitSignature}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/signature/[signatureId=stringSegment]',
				{
					signatureId: selection.entitySelector.signatureId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={gitSignature}>
			{#snippet children(entity)}
				{[entity.verificationStatus, entity.signatureKind].filter(Boolean).join(' ') || selection.entitySelector.signatureId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>signature ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.signatureId} />
				</dd>
			</div>

			<div>
				<dt>subject object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									subjectObjectId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.subjectObjectId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signature kind</dt>
				<dd>
					<ResourceBoundary
						resource={gitSignature}
					>
						{#snippet children(entity)}
							{entity.signatureKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>verification status</dt>
				<dd>
					<ResourceBoundary
						resource={gitSignature}
					>
						{#snippet children(entity)}
							{entity.verificationStatus}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadHash = entity.payloadHash}
					{#if payloadHash != null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={payloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signature = entity.signature}
					{#if signature != null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={signature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedAtMs = entity.verifiedAtMs}
					{#if verifiedAtMs != null}
						<div>
							<dt>verified AT ms</dt>
							<dd>
								<Timestamp timestamp={verifiedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evidenceUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceUrl = entity.evidenceUrl}
					{#if evidenceUrl != null}
						<div>
							<dt>evidence URL</dt>
							<dd>
								<a
									href={evidenceUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={evidenceUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
