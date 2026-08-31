<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.RadicleIdentityDocument>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleIdentityDocument}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/radicle/identity/[rid=stringSegment]/revision/[revision=stringSegment]',
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureThreshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureThreshold = entity.signatureThreshold}
					{#if signatureThreshold != null}
						<div>
							<dt>signature threshold</dt>
							<dd>
								{signatureThreshold}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedSignatureCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedSignatureCount = entity.verifiedSignatureCount}
					{#if verifiedSignatureCount != null}
						<div>
							<dt>verified signature count</dt>
							<dd>
								{verifiedSignatureCount}
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
				{#snippet children(entity)}
					{@const verificationStatus = entity.verificationStatus}
					{#if verificationStatus != null}
						<div>
							<dt>verification status</dt>
							<dd>
								{verificationStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$repository}
			>
				{#snippet children(radicleRepository)}
					{#if radicleRepository != null}
						<div>
							<dt>repository</dt>
							<dd>
								<RadicleRepositoryView
									selection={select(EntityType.RadicleRepository, radicleRepository[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
