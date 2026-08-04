<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LensUsernameNamespace, data.selector, {
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			namespace: true,
			tokenName: true,
			totalUsernames: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensUsernameNamespaceView from '$/views/LensUsernameNamespaceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'Lens username namespace' : [(pageSelection.entity.namespace ?? ''), (pageSelection.entity.tokenName ?? '')].filter(Boolean).join(' ') || 'Lens username namespace')} • Lens username namespace • Blockhead</title>
</svelte:head>


<Page>
	<LensUsernameNamespaceView
		selection={pageSelection}
	/>
</Page>
