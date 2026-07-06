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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCertifiedState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IcpCertifiedState>>
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
	const icpCertifiedState = $derived(selection({}))
	const titleFallback = $derived('ICP certified state')
	const viewDomId = $derived('icp-certified-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCertifiedState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={icpCertifiedState}>
			{#snippet Pending()}
				{title || 'ICP certified state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>certificate hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									certificateHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const certificateHash = selection.entitySelector.certificateHash ?? prefetched.certificateHash}
							{#if certificateHash !== undefined && certificateHash !== null}
								<TruncatedValue value={String((certificateHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const certificateHash = resolvedEntity.certificateHash}
							{#if certificateHash !== undefined && certificateHash !== null}
								<TruncatedValue value={String((certificateHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>path hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pathHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pathHash = selection.entitySelector.pathHash ?? prefetched.pathHash}
							{#if pathHash !== undefined && pathHash !== null}
								<TruncatedValue value={String((pathHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pathHash = resolvedEntity.pathHash}
							{#if pathHash !== undefined && pathHash !== null}
								<TruncatedValue value={String((pathHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							treeHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const treeHash = prefetched.treeHash}
					{#if treeHash !== undefined && treeHash !== null}
						<div>
							<dt>tree hash</dt>
							<dd>
								<TruncatedValue value={String((treeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const treeHash = resolvedEntity.treeHash}
					{#if treeHash !== undefined && treeHash !== null}
						<div>
							<dt>tree hash</dt>
							<dd>
								<TruncatedValue value={String((treeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certifiedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const certifiedAtMs = prefetched.certifiedAtMs}
					{#if certifiedAtMs !== undefined && certifiedAtMs !== null}
						<div>
							<dt>certified AT ms</dt>
							<dd>
								{String((certifiedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const certifiedAtMs = resolvedEntity.certifiedAtMs}
					{#if certifiedAtMs !== undefined && certifiedAtMs !== null}
						<div>
							<dt>certified AT ms</dt>
							<dd>
								{String((certifiedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetSignature: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetSignature = prefetched.subnetSignature}
					{#if subnetSignature !== undefined && subnetSignature !== null}
						<div>
							<dt>subnet signature</dt>
							<dd>
								<TruncatedValue value={String((subnetSignature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetSignature = resolvedEntity.subnetSignature}
					{#if subnetSignature !== undefined && subnetSignature !== null}
						<div>
							<dt>subnet signature</dt>
							<dd>
								<TruncatedValue value={String((subnetSignature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
						<div>
							<dt>verification status</dt>
							<dd>
								{String((verificationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verificationStatus = resolvedEntity.verificationStatus}
					{#if verificationStatus !== undefined && verificationStatus !== null}
						<div>
							<dt>verification status</dt>
							<dd>
								{String((verificationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
