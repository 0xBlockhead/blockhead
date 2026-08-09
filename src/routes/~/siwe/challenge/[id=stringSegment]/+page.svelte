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

	const pageSelection = $derived(select(EntityType.BlockheadSiweChallenge, {
		id: params.id,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			domain: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSiweChallengeView from '$/views/BlockheadSiweChallengeView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'blockhead siwe challenge' : pageSelection.entity.domain || 'blockhead siwe challenge'} • blockhead siwe challenge • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSiweChallengeView
		selection={pageSelection}
	/>
</Page>
