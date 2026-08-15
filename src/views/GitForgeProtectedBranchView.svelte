<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.GitForgeProtectedBranch>, 'prefetched'> = $props()

	const forgeMirror = $derived(selection.entitySelector.$forgeMirror)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeProtectedBranch}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.name || 'Git forge protected branch')}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/protected-branch/[name=stringSegment]',
				{
					forgeHost: forgeMirror.forgeHost,
					owner: forgeMirror.owner,
					repositoryName: forgeMirror.repositoryName,
					name: selection.entitySelector.name,
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
				<dt>forge mirror</dt>
				<dd>
					<GitForgeMirrorView
						selection={select(EntityType.GitForgeMirror, selection.entitySelector.$forgeMirror)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>name</dt>
				<dd>
					{selection.entitySelector.name}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerProtectedBranchId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerProtectedBranchId = entity.providerProtectedBranchId}
					{#if providerProtectedBranchId != null}
						<div>
							<dt>provider protected branch ID</dt>
							<dd>
								{providerProtectedBranchId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>push access</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pushAccessDescriptions: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.pushAccessDescriptions.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>merge access</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									mergeAccessDescriptions: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.mergeAccessDescriptions.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>unprotect access</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									unprotectAccessDescriptions: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.unprotectAccessDescriptions.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>allow force push</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									allowForcePush: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.allowForcePush ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>code owner approval required</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									codeOwnerApprovalRequired: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.codeOwnerApprovalRequired ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							inherited: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inherited = entity.inherited}
					{#if inherited != null}
						<div>
							<dt>inherited</dt>
							<dd>
								{inherited ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
