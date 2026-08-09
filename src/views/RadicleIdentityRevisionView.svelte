<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.RadicleIdentityRevision>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleIdentityRevision}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/radicle/identity/[rid=stringSegment]/revision/[revision=stringSegment]/(radicleIdentityDocument)/document',
				{
					rid: selection.entitySelector.rid,
					revision: selection.entitySelector.revision,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
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
