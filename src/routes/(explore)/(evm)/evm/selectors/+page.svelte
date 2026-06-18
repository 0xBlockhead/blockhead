<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
</script>


<Page>
	<EvmSelectorsView
		href={resolve('/evm/selectors')}
		selection={select(
			EntityType.EvmProtocol,
			{
				scope: 'EvmProtocol',
			}
		).$$evmSelectors}
		id="selectors"
	/>
</Page>
