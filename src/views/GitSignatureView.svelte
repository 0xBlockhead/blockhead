<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.GitSignature>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitSignature>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const gitSignature = $derived(selection({
		fields: {
			verificationStatus: true,
			signatureKind: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.signatureId ?? prefetched.signatureId) ?? '')].filter(Boolean).join(' ') || 'Git signature')
	const viewDomId = $derived('git-signature-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.GitSignature}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitSignature}>
			{#snippet Pending()}
				{[String((selection.entitySelector.signatureId ?? prefetched.signatureId) ?? '')].filter(Boolean).join(' ') || title || 'Git signature'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.signatureId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitSignature}>
			{#snippet Pending()}
				{[String((prefetched.verificationStatus) ?? ''), String((prefetched.signatureKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.signatureId ?? prefetched.signatureId) ?? '')].filter(Boolean).join(' ') || title || 'Git signature'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.verificationStatus) ?? ''), String((resolvedEntity.signatureKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.signatureId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>signature ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signatureId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signatureId = selection.entitySelector.signatureId ?? prefetched.signatureId}
							{#if signatureId !== undefined && signatureId !== null}
								<TruncatedValue value={String((signatureId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signatureId = resolvedEntity.signatureId}
							{#if signatureId !== undefined && signatureId !== null}
								<TruncatedValue value={String((signatureId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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
						{#snippet Pending()}
							{@const subjectObjectId = prefetched.subjectObjectId}
							{#if subjectObjectId !== undefined && subjectObjectId !== null}
								{String((subjectObjectId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subjectObjectId = resolvedEntity.subjectObjectId}
							{#if subjectObjectId !== undefined && subjectObjectId !== null}
								{String((subjectObjectId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signature kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signatureKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signatureKind = prefetched.signatureKind}
							{#if signatureKind !== undefined && signatureKind !== null}
								<TruncatedValue value={String((signatureKind) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signatureKind = resolvedEntity.signatureKind}
							{#if signatureKind !== undefined && signatureKind !== null}
								<TruncatedValue value={String((signatureKind) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>verification status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									verificationStatus: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const verificationStatus = prefetched.verificationStatus}
							{#if verificationStatus !== undefined && verificationStatus !== null}
								{String((verificationStatus) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const verificationStatus = resolvedEntity.verificationStatus}
							{#if verificationStatus !== undefined && verificationStatus !== null}
								{String((verificationStatus) ?? '')}
							{/if}
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
				{#snippet Pending()}
					{@const verifier = prefetched.verifier}
					{#if verifier !== undefined && verifier !== null}
						<div>
							<dt>verifier</dt>
							<dd>
								{String((verifier) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifier = resolvedEntity.verifier}
					{#if verifier !== undefined && verifier !== null}
						<div>
							<dt>verifier</dt>
							<dd>
								{String((verifier) ?? '')}
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
				{#snippet Pending()}
					{@const payloadHash = prefetched.payloadHash}
					{#if payloadHash !== undefined && payloadHash !== null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={String((payloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payloadHash = resolvedEntity.payloadHash}
					{#if payloadHash !== undefined && payloadHash !== null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={String((payloadHash) ?? '')} />
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
				{#snippet Pending()}
					{@const signature = prefetched.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signature = resolvedEntity.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
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
				{#snippet Pending()}
					{@const verifiedAtMs = prefetched.verifiedAtMs}
					{#if verifiedAtMs !== undefined && verifiedAtMs !== null}
						<div>
							<dt>verified AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(verifiedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedAtMs = resolvedEntity.verifiedAtMs}
					{#if verifiedAtMs !== undefined && verifiedAtMs !== null}
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
				{#snippet Pending()}
					{@const evidenceUrl = prefetched.evidenceUrl}
					{#if evidenceUrl !== undefined && evidenceUrl !== null}
						<div>
							<dt>evidence URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(evidenceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evidenceUrl = resolvedEntity.evidenceUrl}
					{#if evidenceUrl !== undefined && evidenceUrl !== null}
						<div>
							<dt>evidence URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(evidenceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
