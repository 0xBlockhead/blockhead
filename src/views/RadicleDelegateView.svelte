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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.RadicleDelegate> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleDelegate}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<RadicleRepositoryView
						selection={select(EntityType.RadicleRepository, selection.entitySelector.$repository)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>DID</dt>
				<dd>
					{selection.entitySelector.did}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							role: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const role = entity.role}
					{#if role != null}
						<div>
							<dt>role</dt>
							<dd>
								{role}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validFromRevision: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validFromRevision = entity.validFromRevision}
					{#if validFromRevision != null}
						<div>
							<dt>valid from revision</dt>
							<dd>
								{validFromRevision}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validToRevision: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validToRevision = entity.validToRevision}
					{#if validToRevision != null}
						<div>
							<dt>valid to revision</dt>
							<dd>
								{validToRevision}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
