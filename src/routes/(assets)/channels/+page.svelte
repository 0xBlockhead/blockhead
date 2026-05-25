<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import StateChannelsView from '$/views/StateChannelsView.svelte'
</script>


<Page>
	<StateChannelsView
		href={resolve('/channels')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$stateChannels',
		}}
		id="channels"
	/>
</Page>
