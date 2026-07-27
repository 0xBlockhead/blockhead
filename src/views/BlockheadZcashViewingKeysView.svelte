<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Zcash viewing keys',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZcashViewingKey> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashViewingKey}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				keyFingerprint: true,
				keyKind: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadZcashViewingKey })}
		{@const blockheadZcashViewingKeySelector = blockheadZcashViewingKey[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadZcashViewingKey}
			entitySelector={blockheadZcashViewingKeySelector}
		>
			{#snippet Title()}
				{blockheadZcashViewingKeySelector.keyFingerprint || 'blockhead zcash viewing key'}
			{/snippet}

			{#snippet Value()}
				{blockheadZcashViewingKey.keyKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZcashViewingKey.$network.name || (blockheadZcashViewingKey.$network.caip2 == null ? '' : `${blockheadZcashViewingKey.$network.caip2.namespace}:${blockheadZcashViewingKey.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
