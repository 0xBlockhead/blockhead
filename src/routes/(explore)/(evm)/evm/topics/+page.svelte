<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
</script>


<Page>
	<EvmTopicsView
		href={resolve('/evm/topics')}
		entityFieldReference={{
			entityType: EntityType.EvmProtocol,
			selector: {
				scope: 'EvmProtocol',
			},
			fieldName: '$$evmTopics',
		}}
		id="topics"
	/>
</Page>
