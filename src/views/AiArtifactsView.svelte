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
		})
	}
>
	{#snippet Item({ item: aiArtifact })}
		{@const aiArtifactSelector = aiArtifact[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiArtifact}
			entitySelector={aiArtifactSelector}
			href={
				aiArtifactSelector.providerArtifactId !== undefined
				&& aiArtifactSelector.$provider !== undefined
				&& aiArtifactSelector.$provider.providerId !== undefined ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/artifact/[providerArtifactId=stringSegment]',
						{
							providerId: aiArtifactSelector.$provider.providerId,
							providerArtifactId: aiArtifactSelector.providerArtifactId,
						}
					)
				:
					aiArtifactSelector.digestAlgorithm !== undefined
					&& aiArtifactSelector.digest !== undefined ?
						resolve(
							'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]',
							{
								digestAlgorithm: aiArtifactSelector.digestAlgorithm,
								digest: aiArtifactSelector.digest,
							}
						)
					:
						aiArtifactSelector.ociDigest !== undefined ?
							resolve(
								'/(ai)/ai/artifact/oci/[ociDigest=stringSegment]',
								{
									ociDigest: aiArtifactSelector.ociDigest,
								}
							)
						:
							aiArtifactSelector.ipfsCid !== undefined ?
								resolve(
									'/(ai)/ai/artifact/ipfs/[ipfsCid=stringSegment]',
									{
										ipfsCid: aiArtifactSelector.ipfsCid,
									}
								)
							:
								aiArtifactSelector.arweaveId !== undefined ?
									resolve(
										'/(ai)/ai/artifact/arweave/[arweaveId=stringSegment]',
										{
											arweaveId: aiArtifactSelector.arweaveId,
										}
									)
								:
									aiArtifactSelector.gitObject !== undefined ?
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
				{(aiArtifact.artifactType ?? '') || [(aiArtifact.providerArtifactId ?? ''), (aiArtifact.ociDigest ?? ''), (aiArtifact.ipfsCid ?? ''), (aiArtifact.arweaveId ?? ''), (aiArtifact.gitObject ?? ''), (aiArtifact.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact'}
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
