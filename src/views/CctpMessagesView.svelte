<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CctpMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CctpMessage}
	bind:open
	resource={
		selection({
			fields: {
				nonce: true,
				sourceDomain: true,
				messageHash: true,
			},
		})
	}
>
	{#snippet Item({ item: cctpMessage })}
		{@const cctpMessageSelector = cctpMessage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CctpMessage}
			entitySelector={cctpMessageSelector}
		>
			{#snippet Title()}
				{cctpMessageSelector.nonce || 'CCTP message'}
			{/snippet}

			{#snippet Value()}
				{cctpMessageSelector.sourceDomain}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cctpMessage.messageHash ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
