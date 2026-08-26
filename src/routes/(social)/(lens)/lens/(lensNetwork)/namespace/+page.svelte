<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import LensUsernameNamespacesView from '$/views/LensUsernameNamespacesView.svelte'
</script>


<svelte:head>
	<title>Lens username namespaces • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.LensNetwork, {
		scope: 'LensNetwork',
	})
		.$$usernameNamespaces({
			sources: [
				Source.Constants_Internal,
				Source.Lens_Graphql,
			],
		})}

	<LensUsernameNamespacesView
		href={resolve('/(social)/(lens)/lens/(lensNetwork)/namespace')}
		title='Lens username namespaces'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='username-namespaces'
	/>
</Page>
