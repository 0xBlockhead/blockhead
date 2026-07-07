<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<Page>
	<EvmCalldataView
		href={resolve('/(explore)/(evm)/evm/(calldata)/calldata')}
		selection={
			select(EntityType.EvmCalldata, {
				hex: '0x00000000',
			})
		}
	/>
</Page>
