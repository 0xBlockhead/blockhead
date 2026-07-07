<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<Page>
	<MevBuilderView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
				caip2: params.caip2,
				builderPubkey: params.builderPubkey,
			})
		}
		selection={
			select(EntityType.MevBuilder, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				builderPubkey: decodeURIComponent(params.builderPubkey),
			})
		}
	/>
</Page>
