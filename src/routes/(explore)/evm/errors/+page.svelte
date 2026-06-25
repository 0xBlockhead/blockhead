<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
</script>


<Page>
	<EvmErrorsView
		href={resolve('/evm/errors')}
		selection={select(
			EntityType.EvmProtocol,
			{
				scope: 'EvmProtocol',
			}
		).$$evmErrors}
		id="errors"
	/>
</Page>
