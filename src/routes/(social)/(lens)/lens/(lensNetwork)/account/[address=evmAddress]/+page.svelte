<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LensAccount, data.selector, {
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			$icon: true,
			displayName: true,
			localName: true,
			legacyProfileId: true,
			createdAt: true,
			owner: true,
			score: true,
			iconUrl: true,
			bio: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.address ?? '') || 'Lens account' : [(pageSelection.entity.displayName ?? ''), (pageSelection.entity.localName ?? ''), String(pageSelection.entitySelector.address), (pageSelection.entity.legacyProfileId ?? '')].filter(Boolean).join(' ') || 'Lens account'))} • Lens account • Blockhead</title>
</svelte:head>


<Page>
	<LensAccountView
		selection={pageSelection}
	/>
</Page>
