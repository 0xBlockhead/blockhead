<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [],
		content: {
			dl: [
				[],
			],
		},
		details: {
			tabs: [
				{
					label: 'workchains',
					when: 'open',
					items: [
						'$$workchains',
					],
				},
				{
					label: 'blocks',
					when: 'open',
					items: [
						'$$blocks',
					],
				},
				{
					label: 'transactions',
					when: 'open',
					items: [
						'$$transactions',
					],
				},
				{
					label: 'accounts',
					when: 'open',
					items: [
						'$$accounts',
					],
				},
				{
					label: 'contracts',
					when: 'open',
					items: [
						'$$contracts',
					],
				},
				{
					label: 'messages',
					when: 'open',
					items: [
						'$$messages',
					],
				},
				{
					label: 'traces',
					when: 'open',
					items: [
						'$$traces',
					],
				},
				{
					label: 'jettons',
					when: 'open',
					items: [
						'$$jettons',
					],
				},
				{
					label: 'nft collections',
					when: 'open',
					items: [
						'$$nftCollections',
					],
				},
				{
					label: 'nft items',
					when: 'open',
					items: [
						'$$nftItems',
					],
				},
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TonNetwork>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.TonNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
