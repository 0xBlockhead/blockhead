<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GitSignature> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitSignature = $derived(selection({
		fields: {
			verificationStatus: true,
			signatureKind: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.signatureId ?? '') || 'Git signature')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.GitSignature}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.signatureId ?? '') || 'Git signature'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitSignature}>
			{#snippet children(entity)}
				{[entity.verificationStatus, entity.signatureKind].filter(Boolean).join(' ') || pendingEntity.signatureId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>signature ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.signatureId} />
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
							{String(entity.subjectObjectId)}
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
							<TruncatedValue value={entity.signatureKind} />
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
								<TruncatedValue value={String(payloadHash)} />
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
								<Timestamp timestamp={Number(verifiedAtMs)} />
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
									href={String(evidenceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
