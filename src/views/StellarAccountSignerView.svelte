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
	}: EntitySelectionViewProps<EntityType.StellarAccountSigner> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAccountSigner}
	entitySelector={selection.entitySelector}
	title={title ?? 'stellar account signer'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		stellar account signer
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<StellarAccountView
						selection={select(EntityType.StellarAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>signer key</dt>
				<dd>
					{selection.entitySelector.signerKey}
				</dd>
			</div>

			<div>
				<dt>signer type</dt>
				<dd>
					{selection.entitySelector.signerType}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
