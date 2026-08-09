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
		id: params.id,
	}, {
		fields: {
			value: true,
			localName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensUsernameView from '$/views/LensUsernameView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Lens username' : [(pageSelection.entity.value ?? ''), pageSelection.entity.localName].filter(Boolean).join(' ') || 'Lens username'} • Lens username • Blockhead</title>
</svelte:head>


<Page>
	<LensUsernameView
		selection={pageSelection}
	/>
</Page>
