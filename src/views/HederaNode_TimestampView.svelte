<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.HederaNode_Timestamp>, 'prefetched'> = $props()

	const node = $derived(selection.entitySelector.$node)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaNodeView from '$/views/HederaNodeView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNode_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/node/[nodeId=nonNegativeInteger]/(hederaNode)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in node.$network ?
							caip2StringFromValue(node.$network.caip2)
						:
							node.$network.slug
					),
					nodeId: String(node.nodeId),
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
				<dt>node</dt>
				<dd>
					<HederaNodeView
						selection={select(EntityType.HederaNode, selection.entitySelector.$node)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodeAccountId = entity.nodeAccountId}
					{#if nodeAccountId != null}
						<div>
							<dt>node account ID</dt>
							<dd>
								<TruncatedValue value={nodeAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null}
						{@const hederaAccountInitial = untrack(() => hederaAccount)}
						<div>
							<dt>account</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, (hederaAccount ?? hederaAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fileId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fileId = entity.fileId}
					{#if fileId != null}
						<div>
							<dt>file ID</dt>
							<dd>
								{fileId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>memo</dt>
							<dd>
								{memo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							publicKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const publicKey = entity.publicKey}
					{#if publicKey != null}
						<div>
							<dt>public key</dt>
							<dd>
								{publicKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeCertHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodeCertHash = entity.nodeCertHash}
					{#if nodeCertHash != null}
						<div>
							<dt>node cert hash</dt>
							<dd>
								<TruncatedValue value={nodeCertHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakeTinybar = entity.stakeTinybar}
					{#if stakeTinybar != null}
						<div>
							<dt>stake tinybar</dt>
							<dd>
								{stakeTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeRewardedTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakeRewardedTinybar = entity.stakeRewardedTinybar}
					{#if stakeRewardedTinybar != null}
						<div>
							<dt>stake rewarded tinybar</dt>
							<dd>
								{stakeRewardedTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeNotRewardedTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakeNotRewardedTinybar = entity.stakeNotRewardedTinybar}
					{#if stakeNotRewardedTinybar != null}
						<div>
							<dt>stake not rewarded tinybar</dt>
							<dd>
								{stakeNotRewardedTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minStakeTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minStakeTinybar = entity.minStakeTinybar}
					{#if minStakeTinybar != null}
						<div>
							<dt>min stake tinybar</dt>
							<dd>
								{minStakeTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxStakeTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxStakeTinybar = entity.maxStakeTinybar}
					{#if maxStakeTinybar != null}
						<div>
							<dt>max stake tinybar</dt>
							<dd>
								{maxStakeTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
