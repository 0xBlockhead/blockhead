<script lang="ts">
	// Types/constants
	import { CollectionScope } from '$/data/collections/entityCollections.ts'

	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadEntityCollectionView from '$/views/BlockheadEntityCollectionView.svelte'
</script>


<Page>
	<BlockheadEntityCollectionView
		entityId={{
			collectionId: params.collectionId,
			scope: CollectionScope.Global,
		}}
		href={resolve('/~/(manage)/manage/(data)/data/collection/[collectionId]', params)}
		title={'Collection'}
	/>
</Page>
