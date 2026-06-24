<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'walletId',
		],
		content: {
			dl: [
				[
					'walletId',
					'accountIndex',
					'unifiedAddress',
					'transparentAddress',
					'saplingAddress',
					'orchardAddress',
					'birthdayHeight',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
				{
					label: 'viewing keys',
					when: 'open',
					items: [
						'$$viewingKeys',
					],
				},
				{
					label: 'notes',
					when: 'open',
					items: [
						'$$notes',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashWalletState>
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
	entityType={EntityType.BlockheadZcashWalletState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
