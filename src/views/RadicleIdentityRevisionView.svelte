<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.RadicleIdentityRevision> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleIdentityRevision}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>rid</dt>
				<dd>
					{selection.entitySelector.rid}
				</dd>
			</div>

			<div>
				<dt>revision</dt>
				<dd>
					{selection.entitySelector.revision}
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
								{threshold}
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
