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
	}: EntityListViewProps<EntityType.AiArtifact> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiArtifact}
	bind:open
	resource={
		selection({
			...{
				fields: {
					artifactType: true,
					mediaType: true,
					providerArtifactId: true,
					ociDigest: true,
					ipfsCid: true,
					arweaveId: true,
					gitObject: true,
					digest: true,
					size: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aiArtifact })}
		{@const aiArtifactSelector = aiArtifact[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiArtifact}
			entitySelector={aiArtifactSelector}
			href={
				'providerArtifactId' in aiArtifactSelector
				&& '$provider' in aiArtifactSelector
				&& 'providerId' in aiArtifactSelector.$provider ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/artifact/[providerArtifactId=stringSegment]',
						{
							providerId: aiArtifactSelector.$provider.providerId,
							providerArtifactId: aiArtifactSelector.providerArtifactId,
						}
					)
				:
					'digestAlgorithm' in aiArtifactSelector
					&& 'digest' in aiArtifactSelector ?
						resolve(
							'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]',
							{
								digestAlgorithm: aiArtifactSelector.digestAlgorithm,
								digest: aiArtifactSelector.digest,
							}
						)
					:
						'ociDigest' in aiArtifactSelector ?
							resolve(
								'/(ai)/ai/artifact/oci/[ociDigest=stringSegment]',
								{
									ociDigest: aiArtifactSelector.ociDigest,
								}
							)
						:
							'ipfsCid' in aiArtifactSelector ?
								resolve(
									'/(ai)/ai/artifact/ipfs/[ipfsCid=stringSegment]',
									{
										ipfsCid: aiArtifactSelector.ipfsCid,
									}
								)
							:
								'arweaveId' in aiArtifactSelector ?
									resolve(
										'/(ai)/ai/artifact/arweave/[arweaveId=stringSegment]',
										{
											arweaveId: aiArtifactSelector.arweaveId,
										}
									)
								:
									'gitObject' in aiArtifactSelector ?
										resolve(
											'/(ai)/ai/artifact/git/[gitObject=stringSegment]',
											{
												gitObject: aiArtifactSelector.gitObject,
											}
										)
									:
										undefined
			}
		>
			{#snippet Title()}
				{(aiArtifact.artifactType ?? '') || [aiArtifact.providerArtifactId, aiArtifact.ociDigest, aiArtifact.ipfsCid, aiArtifact.arweaveId, aiArtifact.gitObject, aiArtifact.digest].filter(Boolean).join(' ') || 'AI artifact'}
			{/snippet}

			{#snippet Value()}
				{aiArtifact.mediaType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiArtifact.size ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
