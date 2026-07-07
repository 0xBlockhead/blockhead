<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<Page>
	<EvmCalldataView
		href={
			resolve('/(explore)/(evm)/evm/(calldata)/calldata/[hex]', {
				hex: params.hex,
			})
		}
		selection={
			select(EntityType.EvmCalldata, {
				hex: decodeURIComponent(params.hex),
			})
		}
	/>
</Page>
