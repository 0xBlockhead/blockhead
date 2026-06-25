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
		'timestampMs',
		'source',
		{
			label: 'balance',
		},
	],
	content: {
		dl: [
			[
				'timestampMs',
				'source',
				{
					label: 'balance',
				},
				'status',
				{
					label: 'last transaction lt/hash',
				},
			],
			[
				'codeHash',
				'dataHash',
				'stateHash',
				{
					label: 'frozen-state hash',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent TON account',
					},
				],
			},
			{
				label: 'State hashes',
				items: [
					{
						label: 'code/data/state/frozen hashes',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw account-state payload',
					},
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
			selection: EntityProxyResource<typeof schema, EntityType.TonAccount_Timestamp>
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
	entityType={EntityType.TonAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
