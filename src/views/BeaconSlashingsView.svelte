<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Slashings',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconSlashing> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconSlashing}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInKind: true,
				kind: true,
				$block: {
					fields: {
						version: true,
						$slot: {
							fields: {
								$epoch: true,
							},
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: beaconSlashing })}
		{@const beaconSlashingSelector = beaconSlashing[EntityMetaKey.Selector]}
		{@const block = beaconSlashingSelector.$block}
		<EntityView
			entityType={EntityType.BeaconSlashing}
			entitySelector={beaconSlashingSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/slashing/[kind=stringSegment]/[indexInKind=nonNegativeInteger]',
					{
						network: (
							block.$network.caip2 !== undefined ?
								caip2StringFromValue(block.$network.caip2)
							:
								block.$network.slug
						),
						root: block.root,
						kind: beaconSlashingSelector.kind,
						indexInKind: String(beaconSlashingSelector.indexInKind),
					}
				)
			}
		>
			{#snippet Title()}
				{`Slashing #${beaconSlashingSelector.indexInKind}`}
			{/snippet}

			{#snippet Value()}
				{beaconSlashingSelector.kind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconSlashingSelector.$block.root || 'beacon block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
