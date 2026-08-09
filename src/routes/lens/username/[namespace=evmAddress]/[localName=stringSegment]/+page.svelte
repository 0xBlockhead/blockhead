<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LensUsername, {
		namespace: params.namespace,
		localName: params.localName,
	}, {
		fields: {
			value: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensUsernameView from '$/views/LensUsernameView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.localName ?? '') || 'Lens username' : [(pageSelection.entity.value ?? ''), pageSelection.entitySelector.localName].filter(Boolean).join(' ') || 'Lens username'} • Lens username • Blockhead</title>
</svelte:head>


<Page>
	<LensUsernameView
		selection={pageSelection}
	/>
</Page>
