<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.LensAccount_Timestamp, {
		$account: {
			address: params.address,
		},
		timestampMs: Number(params.timestampMs),
	}, {
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			followerCount: true,
			followingCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccount_TimestampView from '$/views/LensAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{'Lens account observation'} • Lens account observation • Blockhead</title>
</svelte:head>


<Page>
	<LensAccount_TimestampView
		selection={pageSelection}
	/>
</Page>
