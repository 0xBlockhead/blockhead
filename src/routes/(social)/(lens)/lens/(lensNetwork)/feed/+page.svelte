<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import LensFeedsView from '$/views/LensFeedsView.svelte'
</script>


<svelte:head>
	<title>Lens feeds • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.LensNetwork, {
		scope: 'LensNetwork',
	})
		.$$feeds({
			sources: [
				Source.Constants_Internal,
				Source.Lens_Graphql,
			],
		})}

	<LensFeedsView
		href={resolve('/(social)/(lens)/lens/(lensNetwork)/feed')}
		title='Lens feeds'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='feeds'
	/>
</Page>
