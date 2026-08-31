<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.BeaconWithdrawal>, 'prefetched'> = $props()

	const block = $derived(selection.entitySelector.$block)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	}))
	const beaconWithdrawal = $derived(viewSelection({
		fields: {
			amountGwei: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconWithdrawal}
	entitySelector={selection.entitySelector}
	title={title ?? `Withdrawal #${selection.entitySelector.withdrawalIndex}`}
	idDragPlainText={String(selection.entitySelector.withdrawalIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/withdrawal/[withdrawalIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in block.$network ?
							caip2StringFromValue(block.$network.caip2)
						:
							block.$network.slug
					),
					root: block.root,
					withdrawalIndex: String(selection.entitySelector.withdrawalIndex),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Withdrawal </span>
			<span data-badge="small">
				#{selection.entitySelector.withdrawalIndex}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconWithdrawal}>
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
				<dt>Withdrawal index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.withdrawalIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>Index in block</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									indexInBlock: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.indexInBlock}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={beaconWithdrawal}
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
				<dt>Account</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$account}
					>
						{#snippet children(evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Beacon block</dt>
				<dd>
					<BeaconBlockView
						selection={select(EntityType.BeaconBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
