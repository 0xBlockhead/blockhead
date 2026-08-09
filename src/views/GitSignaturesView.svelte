<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GitSignature> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitSignature}
	bind:open
	resource={
		selection({
			...{
				fields: {
					signatureId: true,
					verificationStatus: true,
					signatureKind: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: gitSignature })}
		{@const gitSignatureSelector = gitSignature[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitSignature}
			entitySelector={gitSignatureSelector}
			href={
				resolve(
					'/git/signature/[signatureId=stringSegment]',
					{
						signatureId: gitSignatureSelector.signatureId,
					}
				)
			}
		>
			{#snippet Title()}
				{gitSignatureSelector.signatureId || 'Git signature'}
			{/snippet}

			{#snippet Value()}
				{[gitSignature.verificationStatus, gitSignature.signatureKind].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
