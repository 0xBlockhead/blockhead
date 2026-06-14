<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.EvmProtocol,
			selector: {
				scope: 'EvmProtocol',
			},
			fieldName: '$$evmErrors',
		}}
		id="errors"
	/>
</Page>
