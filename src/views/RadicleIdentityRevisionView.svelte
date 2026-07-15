<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.RadicleIdentityRevision>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.RadicleIdentityRevision>>
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
	const radicleIdentityRevision = $derived(selection({}))
	const titleFallback = $derived('radicle identity revision')
	const viewDomId = $derived('radicle-identity-revision-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleIdentityRevision}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={radicleIdentityRevision}>
			{#snippet Pending()}
				{title || 'radicle identity revision'}
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
				<dt>rid</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									rid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const rid = pendingEntity.rid}
							{#if rid !== undefined && rid !== null}
								{String((rid) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rid = resolvedEntity.rid}
							{#if rid !== undefined && rid !== null}
								{String((rid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>revision</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									revision: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const revision = pendingEntity.revision}
							{#if revision !== undefined && revision !== null}
								{String((revision) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const revision = resolvedEntity.revision}
							{#if revision !== undefined && revision !== null}
								{String((revision) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousRevision: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousRevision = pendingEntity.previousRevision}
					{#if previousRevision !== undefined && previousRevision !== null}
						<div>
							<dt>previous revision</dt>
							<dd>
								{String((previousRevision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousRevision = resolvedEntity.previousRevision}
					{#if previousRevision !== undefined && previousRevision !== null}
						<div>
							<dt>previous revision</dt>
							<dd>
								{String((previousRevision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>document hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									documentHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const documentHash = pendingEntity.documentHash}
							{#if documentHash !== undefined && documentHash !== null}
								<TruncatedValue value={String((documentHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const documentHash = resolvedEntity.documentHash}
							{#if documentHash !== undefined && documentHash !== null}
								<TruncatedValue value={String((documentHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>delegate dids</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									delegateDids: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const delegateDids = pendingEntity.delegateDids}
							{#if delegateDids !== undefined && delegateDids !== null}
								{delegateDids.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const delegateDids = resolvedEntity.delegateDids}
							{#if delegateDids !== undefined && delegateDids !== null}
								{delegateDids.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							threshold: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const threshold = pendingEntity.threshold}
					{#if threshold !== undefined && threshold !== null}
						<div>
							<dt>threshold</dt>
							<dd>
								{String((threshold) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const threshold = resolvedEntity.threshold}
					{#if threshold !== undefined && threshold !== null}
						<div>
							<dt>threshold</dt>
							<dd>
								{String((threshold) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>signed by dids</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signedByDids: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const signedByDids = pendingEntity.signedByDids}
							{#if signedByDids !== undefined && signedByDids !== null}
								{signedByDids.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signedByDids = resolvedEntity.signedByDids}
							{#if signedByDids !== undefined && signedByDids !== null}
								{signedByDids.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
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
							{@const verificationStatus = pendingEntity.verificationStatus}
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
		</dl>
	{/snippet}
</EntityView>
