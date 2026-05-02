<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import StateChannelsView from '$/views/StateChannelsView.svelte'
</script>


<Page>
	<StateChannelsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$stateChannels',
		}}
		href={resolve('/channels')}
		id="channels"
	/>
</Page>
