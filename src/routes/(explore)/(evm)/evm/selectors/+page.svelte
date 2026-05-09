<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
</script>


<Page>
	<EvmSelectorsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$selectors',
		}}
		href={resolve('/evm/selectors')}
		id="selectors"
	/>
</Page>
