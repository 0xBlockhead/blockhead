<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.NearAccessKey>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)
	const nearAccessKey = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			permission: true,
			nonce: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.publicKey || 'near access key')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.NearAccessKey}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/access-key/[publicKey=stringSegment]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
					),
					accountId: account.accountId,
					publicKey: selection.entitySelector.publicKey,
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
		<TruncatedValue value={selection.entitySelector.publicKey} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearAccessKey}>
			{#snippet children(entity)}
				{(entity.permission ?? '') || selection.entitySelector.publicKey || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearAccessKey}>
			{#snippet children(entity)}
				{@const nonce = entity.nonce}
				{#if nonce != null}
					<span data-text="muted">
						<NumberValue
							value={nonce}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<NearAccountView
						selection={select(EntityType.NearAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Public key</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.publicKey} />
				</dd>
			</div>

			<ResourceBoundary
				resource={nearAccessKey}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue
									value={nonce}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nearAccessKey}
			>
				{#snippet children(entity)}
					{@const permission = entity.permission}
					{#if permission != null}
						<div>
							<dt>Permission</dt>
							<dd>
								{permission}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
