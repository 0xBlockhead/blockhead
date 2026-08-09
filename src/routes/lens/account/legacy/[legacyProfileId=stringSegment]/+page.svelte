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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LensAccount, {
		legacyProfileId: params.legacyProfileId,
	}, {
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			displayName: true,
			localName: true,
			address: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.legacyProfileId ?? '') || 'Lens account' : [(pageSelection.entity.displayName ?? ''), pageSelection.entity.localName, pageSelection.entity.address, pageSelection.entitySelector.legacyProfileId].filter(Boolean).join(' ') || 'Lens account'} • Lens account • Blockhead</title>
</svelte:head>


<Page>
	<LensAccountView
		selection={pageSelection}
	/>
</Page>
