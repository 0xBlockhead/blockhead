<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.EvmProtocol,
			entityId: {
				scope: 'EvmProtocol',
			},
			fieldName: '$$evmSelectors',
		}}
		id="selectors"
	/>
</Page>
