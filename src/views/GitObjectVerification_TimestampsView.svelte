<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GitObjectVerification_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitObjectVerification_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				objectId: true,
				status: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: gitObjectVerificationTimestamp })}
		{@const gitObjectVerificationTimestampSelector = gitObjectVerificationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitObjectVerification_Timestamp}
			entitySelector={gitObjectVerificationTimestampSelector}
		>
			{#snippet Title()}
				{String(gitObjectVerificationTimestampSelector.objectId) || 'Git object verification timestamp'}
			{/snippet}

			{#snippet Value()}
				{gitObjectVerificationTimestamp.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(gitObjectVerificationTimestampSelector.timestampMs)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
