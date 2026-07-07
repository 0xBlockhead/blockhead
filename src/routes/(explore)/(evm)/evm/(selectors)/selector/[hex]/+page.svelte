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
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<Page>
	<EvmSelectorView
		href={
			resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
				hex: params.hex,
			})
		}
		selection={
			select(EntityType.EvmSelector, {
				hex: decodeURIComponent(params.hex),
			}, {
				sources: [
					Source.Openchain_Rest,
				],
				fields: {
					signatures: true,
				},
			})
		}
	/>
</Page>
