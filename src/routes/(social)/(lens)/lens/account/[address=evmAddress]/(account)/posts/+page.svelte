<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<svelte:head>
	<title>Lens account posts • Blockhead</title>
</svelte:head>


<Page>
	<LensPostsView
		href={
			resolve('/(social)/(lens)/lens/account/[address=evmAddress]/(account)/posts', {
				address: params.address,
			})
		}
		title='Lens account posts'
		selection={
			select(EntityType.LensAccount, {
				address: decodeURIComponent(params.address),
			}).$$posts({
				sources: [
					Source.Lens_Graphql,
				],
			})
		}
		id='posts'
	/>
</Page>
