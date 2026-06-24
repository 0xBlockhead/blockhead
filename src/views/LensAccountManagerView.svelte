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
		{
			label: 'account',
		},
		{
			label: 'manager address',
		},
		{
			label: 'added time',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'account',
				},
				{
					label: 'manager address',
				},
				{
					label: 'added time',
				},
				{
					label: 'Lens manager flag',
				},
				{
					label: 'transaction permission',
				},
				{
					label: 'metadata permission',
				},
				{
					label: 'native transfer permission',
				},
				{
					label: 'token transfer permission',
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
						label: 'parent Lens account',
					},
				],
			},
			{
				label: 'Manager address',
				items: [
					{
						label: 'manager EVM account when resolved',
					},
				],
			},
			{
				label: 'Permissions',
				items: [
					{
						label: 'manager permission booleans',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'accountManagers GraphQL payload',
					},
					{
						label: 'on-chain manager events when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.LensAccountManager>
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
	entityType={EntityType.LensAccountManager}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
