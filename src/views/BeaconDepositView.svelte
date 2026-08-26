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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BeaconDeposit>, 'prefetched'> = $props()

	const block = $derived(selection.entitySelector.$block)
	const beaconDeposit = $derived(selection({
		fields: {
			pubkey: true,
			amountGwei: true,
		},
	}))
	const titleFallback = $derived(`Deposit #${selection.entitySelector.indexInBlock}`)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconDeposit}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.indexInBlock)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/deposit/[indexInBlock=nonNegativeInteger]',
				{
					network: (
						'caip2' in block.$network ?
							caip2StringFromValue(block.$network.caip2)
						:
							block.$network.slug
					),
					root: block.root,
					indexInBlock: String(selection.entitySelector.indexInBlock),
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
		<ResourceBoundary resource={beaconDeposit}>
			{#snippet children(entity)}
				{entity.pubkey || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconDeposit}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.amountGwei}
				/>

				<span> gwei</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<BeaconBlockView
				selection={select(EntityType.BeaconBlock, selection.entitySelector.$block)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Beacon block</dt>
				<dd>
					<BeaconBlockView
						selection={select(EntityType.BeaconBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Index in block</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.indexInBlock}
					/>
				</dd>
			</div>

			<div>
				<dt>Validator</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$validator}
					>
						{#snippet children(beaconValidator)}
							{@const beaconValidatorInitial = untrack(() => beaconValidator)}
							<BeaconValidatorView
								selection={select(EntityType.BeaconValidator, (beaconValidator ?? beaconValidatorInitial)[EntityMetaKey.Selector])}
								prefetched={beaconValidator ?? beaconValidatorInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Validator pubkey</dt>
				<dd>
					<ResourceBoundary
						resource={beaconDeposit}
					>
						{#snippet children(entity)}
							{entity.pubkey}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Withdrawal credentials</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									withdrawalCredentials: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.withdrawalCredentials}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={beaconDeposit}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.amountGwei}
							/>

							<span> gwei</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Signature</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signature: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signature} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Merkle proof</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									proof: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.proof.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
