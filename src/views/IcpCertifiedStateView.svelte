<!-- Generated from APP.ts. Do not edit by hand. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.IcpCertifiedState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'ICP certified state'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCertifiedState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ICP certified state
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
					<TruncatedValue value={pendingEntity.certificateHash} />
				</dd>
			</div>

			<div>
				<dt>path hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.pathHash} />
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
				{#snippet children(entity)}
					{@const treeHash = entity.treeHash}
					{#if treeHash != null}
						<div>
							<dt>tree hash</dt>
							<dd>
								<TruncatedValue value={treeHash} />
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
				{#snippet children(entity)}
					{@const certifiedAtMs = entity.certifiedAtMs}
					{#if certifiedAtMs != null}
						<div>
							<dt>certified AT ms</dt>
							<dd>
								{String(certifiedAtMs)}
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
				{#snippet children(entity)}
					{@const subnetSignature = entity.subnetSignature}
					{#if subnetSignature != null}
						<div>
							<dt>subnet signature</dt>
							<dd>
								<TruncatedValue value={subnetSignature} />
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
		</dl>
	{/snippet}
</EntityView>
