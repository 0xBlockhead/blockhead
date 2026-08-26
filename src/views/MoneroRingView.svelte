<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MoneroRing>, 'prefetched'> = $props()

	const keyImage = $derived(selection.entitySelector.$keyImage)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoneroRingMembersView from '$/views/MoneroRingMembersView.svelte'
	import MoneroKeyImageView from '$/views/MoneroKeyImageView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRing}
	entitySelector={selection.entitySelector}
	title={title ?? 'monero ring'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]/(moneroKeyImage)/ring',
				{
					network: (
						'caip2' in keyImage.$transaction.$network ?
							caip2StringFromValue(keyImage.$transaction.$network.caip2)
						:
							keyImage.$transaction.$network.slug
					),
					transactionId: keyImage.$transaction.txHash,
					inputIndex: String(keyImage.inputIndex),
					keyImage: keyImage.keyImage,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<MoneroKeyImageView
			selection={select(EntityType.MoneroKeyImage, selection.entitySelector.$keyImage)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		Ring
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Key image</dt>
				<dd>
					<MoneroKeyImageView
						selection={select(EntityType.MoneroKeyImage, selection.entitySelector.$keyImage)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const membersResource = selection.$$members}
		<ResourceBoundary
			resource={membersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MoneroRingMembersView
						selection={membersResource}
						countResource={membersResource.count}
						title='Members'
						id='members'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
