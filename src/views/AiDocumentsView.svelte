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
	}: EntityListViewProps<EntityType.AiDocument> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiDocument}
	bind:open
	resource={
		selection({
			fields: {
				documentKind: true,
				mediaType: true,
				documentUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: aiDocument })}
		{@const aiDocumentSelector = aiDocument[EntityMetaKey.Selector]}
		{@const artifact = aiDocumentSelector.$artifact}
		<EntityView
			entityType={EntityType.AiDocument}
			entitySelector={aiDocumentSelector}
			href={
				'documentKind' in aiDocumentSelector
				&& '$artifact' in aiDocumentSelector
				&& 'digestAlgorithm' in artifact
				&& 'digest' in artifact ?
					resolve(
						'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/document/[documentKind=stringSegment]',
						{
							digestAlgorithm: artifact.digestAlgorithm,
							digest: artifact.digest,
							documentKind: aiDocumentSelector.documentKind,
						}
					)
				:
					'documentKind' in aiDocumentSelector
					&& 'contentHashAlgorithm' in aiDocumentSelector
					&& 'contentHash' in aiDocumentSelector ?
						resolve(
							'/(ai)/ai/document/[documentKind=stringSegment]/hash/[contentHashAlgorithm=stringSegment]/[contentHash=zeroExHex]',
							{
								documentKind: aiDocumentSelector.documentKind,
								contentHashAlgorithm: aiDocumentSelector.contentHashAlgorithm,
								contentHash: aiDocumentSelector.contentHash,
							}
						)
					:
						'documentUrl' in aiDocumentSelector ?
							resolve(
								'/(ai)/ai/document/url/[documentUrl=absoluteUrl]',
								{
									documentUrl: encodeURIComponent(aiDocumentSelector.documentUrl),
								}
							)
						:
							undefined
			}
		>
			{#snippet Title()}
				{aiDocument.documentKind || 'AI document'}
			{/snippet}

			{#snippet Value()}
				{aiDocument.mediaType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiDocument.documentUrl ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
