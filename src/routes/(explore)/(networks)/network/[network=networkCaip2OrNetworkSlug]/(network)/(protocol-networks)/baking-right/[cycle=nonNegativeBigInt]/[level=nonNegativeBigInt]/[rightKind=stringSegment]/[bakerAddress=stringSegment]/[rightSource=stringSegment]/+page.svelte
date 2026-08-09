<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBakingRightView from '$/views/TezosBakingRightView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos baking right'} • tezos baking right • Blockhead</title>
</svelte:head>


<Page>
	<TezosBakingRightView
		selection={
			select(EntityType.TezosBakingRight, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>
