<script lang="ts">
	// Types/constants
	import { CollectionScope } from '$/collections/collectionIds.ts'

	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadEntityCollectionView from '$/views/BlockheadEntityCollectionView.svelte'
</script>


<Page>
	<BlockheadEntityCollectionView
		entityId={{
			collectionId: 'list',
			scope: CollectionScope.Global,
		}}
		href={resolve('/~/manage/data')}
		title={'Data'}
	/>
</Page>
