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
	}: EntitySelectionViewProps<EntityType.RadicleIdentityRevision> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'radicle identity revision'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleIdentityRevision}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		radicle identity revision
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>rid</dt>
				<dd>
					{pendingEntity.rid}
				</dd>
			</div>

			<div>
				<dt>revision</dt>
				<dd>
					{pendingEntity.revision}
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
				{#snippet children(entity)}
					{@const previousRevision = entity.previousRevision}
					{#if previousRevision != null}
						<div>
							<dt>previous revision</dt>
							<dd>
								{previousRevision}
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
						{#snippet children(entity)}
							<TruncatedValue value={entity.documentHash} />
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
						{#snippet children(entity)}
							{entity.delegateDids.values.join(', ')}
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
				{#snippet children(entity)}
					{@const threshold = entity.threshold}
					{#if threshold != null}
						<div>
							<dt>threshold</dt>
							<dd>
								{String(threshold)}
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
						{#snippet children(entity)}
							{entity.signedByDids.values.join(', ')}
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
						{#snippet children(entity)}
							{entity.verificationStatus}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
